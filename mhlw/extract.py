#!/usr/bin/python3
# -*- coding: utf-8 -*-
#
# Extracts data out of MHLW covid pdfs.
#

import sys
import re
import urllib.request
import tempfile
import argparse

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
  deathsRect = (504, 140, 504 + 68, 140 + rowHeight)
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
  subImages = extractImageAreas(image)
  values = {}
  for key in subImages:
    subImage = subImages[key]
    text = pytesseract.image_to_string(subImage)
    num = int(text.replace(',', ''))
    values[key] = num
    #print('%s %d' % (key, num))
  return values

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = '1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY'

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
  result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range="'Sum By Day'!A2:G").execute()
  if not result:
    return False

  values = result.get('values', [])
  lastRow = values[-1]
  if lastRow[0] == valueDate:
    return False

  #sheet.values().append(spreadsheetId=SPREADSHEET_ID, range="'Sum By Day'!A1:G").execute()
  print(values[-1])


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--reportUrl')
  parser.add_argument('--disableExtractRecoveries', action='store_true')
  parser.add_argument('--extractSummary', action='store_true')
  parser.add_argument('--outputText', action="store_true")
  parser.add_argument('--writeResults', action='store_true')
  args = parser.parse_args()

  indexUrl = 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000121431_00204.html'
  reportUrl = None
  if args.reportUrl:
    reportUrl = args.reportUrl
  else:
    reportUrl = getLatestCovidReport(indexUrl)

  reportDate = None
  reportPdfData = None
  tableImageData = None
  
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

  #print(summaryValues)

  if args.writeResults:
    writeValues(reportDate, summaryValues)
