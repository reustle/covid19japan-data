#!/usr/bin/python3
# -*- coding: utf-8 -*-
"""
Extracts data from MHLW COVID PDFs, images and reports, and optionally writes
them to the Google Spreadsheet.

Install:
pip3 install -r requirements.txt
brew install tesseract # for mac


Run:
python3 extract.py --extractSummary --writeOutput

Hacks:
- In order to parse the image table on the COVID report, we hard code the
  the location of the cells we want. If the format of the table changes, or even
  the screenshot size changes, it may fail.
- Camelot works fine on the MHLW per-prefecture recovery PDFs, but we only
  look at the first 47 rows (of the prefectures) and assume that the order is
  in the prefecture order, which is the same as the spreadsheet. If any of them
  change, this will break.

"""

import sys
import re
import urllib.request
import tempfile
import argparse
import pprint

import camelot
import pandas as pd
from bs4 import BeautifulSoup

from PIL import Image
import pytesseract

import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request


def getLatestCovidReport(indexUrl):
  """ 
  Returns the URL for the latest COVID report on MHLW.

  @param indexUrl: URL of the index page of all reports.
  @returns None if no report found, URL of the first report if found.
  """
  covidReportName = '新型コロナウイルス感染症の現在の状況'
  contents = urllib.request.urlopen(indexUrl).read()
  soup = BeautifulSoup(contents, features="html.parser")
  links = soup.find_all('a')
  for link in links:
    if link and link.text and link.text.startswith(covidReportName):
        return link['href']
  return None

def getSummaryTable(soup):
  images = soup.find_all('img')
  for image in images:
    if image and image['src'] and image['src'].startswith('data'):
      return image['src']
  return None

def getReportFromUrl(reportUrl):
  contents = urllib.request.urlopen(reportUrl).read()
  return BeautifulSoup(contents, features="html.parser")

def getReportDate(soup):
  time = soup.find('time')
  if time:
    return time['datetime']
  return None

def getPdfData(soup):
  prefectureRecoveryName = '別紙１'
  images = soup.find_all('img')
  links = soup.find_all('a')
  pdfLink = None
  for link in links:
    if link and link.text and link.text.startswith(prefectureRecoveryName):
      pdfLink = link['href']
      if not pdfLink.startswith('https://'):
        pdfLink = 'https://www.mhlw.go.jp' + pdfLink

  if pdfLink:
    pdfData = urllib.request.urlopen(pdfLink).read()
    return pdfData

  return None


def extractRecoveryNumbers(pdfPath):
  tables = camelot.read_pdf(
      pdfPath, flavor='stream', pages='1')

  summary = tables[0].df.loc[5:, [0, 5]]  

  prefectureValues = []
  for index, row in summary.iterrows():
    prefecture = row[0]
    prefecture = re.sub('※[0-9]', '', prefecture)
    prefecture = re.sub('\s', '', prefecture)

    value = row[5]
    value = re.sub('※[0-9] ', '', value)
    value = re.sub('[^0-9]+', '', value)
    #print('%s:  %s' % (prefecture, value))
    prefectureValues.append((prefecture, value))

  # Strip last two rows
  prefectureValues = prefectureValues[:-2]

  return prefectureValues

def extractImageAreas(image):
  rowHeight = 16
  pcrRect = (70, 140, 70 + 88, 140 + rowHeight)
  criticalRect = (320, 140, 320 + 80, 140 + rowHeight)
  portRecoveriesRect = (400, 84, 400 + 80, 84 + rowHeight)
  recoveriesRect = (400, 140, 400 + 80, 140 + rowHeight)
  deathsRect = (510, 140, 510 + 68, 140 + rowHeight)
  return {
    'pcr': image.crop(pcrRect),
    'critical': image.crop(criticalRect),
    'recoveries': image.crop(recoveriesRect),
    'portRecoveries': image.crop(portRecoveriesRect),
    'deaths': image.crop(deathsRect)
  }

def extractDailySummary(imageUrl):
  imageData = urllib.request.urlopen(imageUrl)
  image = Image.open(imageData)
  image = image.resize((661, 181))
  image = image.convert(mode='L')
  subImages = extractImageAreas(image)
  values = {}
  for key in subImages:
    subImage = subImages[key]
    subImage.save('%s.png' % key)
    text = pytesseract.image_to_string(subImage)
    try:
      numberMatch = re.search('([0-9,]+)', text)
      if numberMatch:
        num = int(numberMatch.group(1).replace(',', ''))
        values[key] = num
      else:
        print('Error: %s does not contain any numbers: %s' % (key, text))
    except ValueError as e:
      print(e)

    #print('%s %d' % (key, num))
  return values

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = '1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY'

def writeSumByDay(sheet, valueDate, values):
  result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range="'Sum By Day'!A2:G").execute()
  if not result:
    print('Error: No results')
    return False

  currentValues = result.get('values', [])
  lastRow = currentValues[-2].copy()
  if lastRow[0] == valueDate:
    print('Value for today %s already exists.' % valueDate)
    return False

  for v in (values['recoveries'], values['deaths'], values['critical'], values['pcr']):
    if not v or v == 0:
      raise ValueError('Not all values for Sum By Day exists')

  todaysRow = [valueDate, '', values['recoveries'], values['deaths'], values['critical'], values['pcr']]
  rowBody = {
    'values': [todaysRow]
  }

  return sheet.values().append(
    spreadsheetId=SPREADSHEET_ID, 
    range="'Sum By Day'",
    valueInputOption='USER_ENTERED',
    body=rowBody).execute()

def writePrefectureData(sheet, values):
  # Check the values
  if 'prefectureRecoveries' not in values:
    raise ValueError('prefectureRecoveries values are unavailable')
  if len(values['prefectureRecoveries']) < 47:
    raise ValueError('prefectureRecoveries are incomplete')
  if 'portRecoveries' not in values or values['portRecoveries'] < 1:
    raise ValueError('portRecoveries are unavailable')

  # result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range="'Prefecture Data'!E3:E50").execute()
  # print(result)

  todaysValues = []
  for v in values['prefectureRecoveries']:
    todaysValues.append([v[1]])
  todaysValues.append([values['portRecoveries']])

  return sheet.values().update(
    spreadsheetId=SPREADSHEET_ID, 
    range="'Prefecture Data'!E3:E50", 
    valueInputOption='USER_ENTERED',
    body = {'values': todaysValues}).execute()

def writeRecoveries(sheet, valueDate, values):
  # Check the values
  if 'prefectureRecoveries' not in values:
    raise ValueError('prefectureRecoveries values are unavailable')
  if len(values['prefectureRecoveries']) < 47:
    raise ValueError('prefectureRecoveries are incomplete')
  if 'portRecoveries' not in values or values['portRecoveries'] < 1:
    raise ValueError('portRecoveries are unavailable')

  # check if the values have already been written.
  result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range="'Recoveries'!C1:C1").execute()
  currentValues = result.get('values', [])
  if currentValues[0][0] == valueDate:
    print('Todays values already written in to Recoveries')
    return False

  # Construct the values for the column.
  todaysRecoveryValues = [[valueDate]]
  for v in values['prefectureRecoveries']:
    todaysRecoveryValues.append([v[1]])
  todaysRecoveryValues.append([values['portRecoveries']])
  todaysRecoveryValues.append([8]) # last value is always 8 recoveries for "Unspecified"

  # Get the Sheet ID for the recoveries
  sheetsResult = sheet.get(spreadsheetId=SPREADSHEET_ID, fields='sheets.properties').execute()
  recoveriesSheetId = 0
  for sheetProperty in sheetsResult['sheets']:
    if sheetProperty['properties']['title'] == 'Recoveries':
      recoveriesSheetId = sheetProperty['properties']['sheetId']
      break

  if not recoveriesSheetId:
    raise ValueError('Unable to find sheetId for Recoveries tab')

  # Insert column into the Recoveries Sheet.
  requests = []
  requests.append({
    'insertDimension': {
      'range': {
        'sheetId': recoveriesSheetId,
        'dimension': 'COLUMNS',
        'startIndex': 2,
        'endIndex': 3
      },
      'inheritFromBefore': True
    }
  })
  result = sheet.batchUpdate(
    spreadsheetId=SPREADSHEET_ID, 
    body = {'requests': requests}).execute()
  print(result)

  # Append values into the sheet.
  return sheet.values().update(
    spreadsheetId=SPREADSHEET_ID, 
    range="'Recoveries'!C1:C50", 
    valueInputOption='USER_ENTERED',
    body = {'values': todaysRecoveryValues}).execute()    


def writeValues(valueDate, values):
  creds=None
  if os.path.exists('token.pickle'):
    with open('token.pickle', 'rb') as token:
      creds = pickle.load(token)
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
        'credentials.json', SCOPES)
      creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open('token.pickle', 'wb') as token:
      pickle.dump(creds, token)

  service = build('sheets', 'v4', credentials=creds)
  sheet = service.spreadsheets()


  print('Writing to Sum By Day Sheet')
  result = writeSumByDay(sheet, valueDate, values)
  print(result)

  print('Writing to Prefecture Data Sheet')
  result = writePrefectureData(sheet, values)
  print(result)

  print('Writing to Recoveries Sheet')
  result = writeRecoveries(sheet, valueDate, values)
  print(result)

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--reportUrl')
  parser.add_argument('--indexUrl', default='https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000121431_00204.html')
  parser.add_argument('--disableExtractRecoveries', action='store_true')
  parser.add_argument('--extractSummary', action='store_true')
  parser.add_argument('--outputText', action="store_true")
  parser.add_argument('--writeResults', action='store_true')
  args = parser.parse_args()

  reportUrl = None
  if args.reportUrl:
    reportUrl = args.reportUrl
  else:
    reportUrl = getLatestCovidReport(args.indexUrl)

  reportDate = None
  reportPdfData = None
  summaryTableUrl = None
  summaryValues = {}

  if reportUrl:
    print(reportUrl)
    reportSoup = getReportFromUrl(reportUrl)
    reportDate = getReportDate(reportSoup)
    summaryTableUrl = getSummaryTable(reportSoup)
    reportPdfData = getPdfData(reportSoup)
    print(reportDate)

  if not args.disableExtractRecoveries:
    if reportPdfData:
      open('test.pdf', 'wb').write(reportPdfData)
      with tempfile.NamedTemporaryFile(suffix='.pdf') as temp:
        temp.write(reportPdfData)
        recoveries = extractRecoveryNumbers(temp.name)
        summaryValues['prefectureRecoveries'] = recoveries

  if args.extractSummary and summaryTableUrl:
    values = extractDailySummary(summaryTableUrl)
    summaryValues.update(values)

  if args.outputText:
    [print(v[1]) for v in summaryValues['prefectureRecoveries']]
    print(summaryValues['portRecoveries'])
    print('---')
    print('recoveries,deaths,critical,tested')
    print('%(recoveries)d\t%(deaths)d\t%(critical)d\t%(pcr)d' % summaryValues)

  if args.writeResults:
    pprint.pprint(summaryValues)
    writeValues(reportDate, summaryValues)
