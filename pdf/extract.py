#!/usr/bin/python3
# -*- coding: utf-8 -*-
#
# Extracts data out of MHLW covid pdfs.
#

import sys
import re
import urllib.request
import tempfile

import camelot
import pandas as pd
from bs4 import BeautifulSoup

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
        return {
          'title': link.text, 
          'link': link['href']
        }
  return None

def getSummaryTableFromReportUrl(reportUrl):
  contents = urllib.request.urlopen(reportUrl).read()
  soup = BeautifulSoup(contents, features="html.parser")
  images = soup.find_all('img')
  for image in images:
    if image and image['src'] and image['src'].startswith('data'):
      return image['src']
  return None

def getPdfDataFromReportUrl(reportUrl):
  prefectureRecoveryName = '別紙１'
  contents = urllib.request.urlopen(reportUrl).read()
  soup = BeautifulSoup(contents, features="html.parser")
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

  recovery = tables[0].df.loc[5:, 5]
  summary = tables[0].df.loc[5:, [0, 5]]

  return [int(v.replace(',','')) for v in recovery]


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
  if len(sys.argv) > 1: 
    print(extractRecoveryNumbers(sys.argv[1]))
    sys.exit(0)

  # writeValues('2020-12-09', None)
  # sys.exit(0)

  indexUrl = 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000121431_00204.html'
  reportLink = getLatestCovidReport(indexUrl)
  reportPdfData = None
  tableImageData = None

  if reportLink:
    print(reportLink['title'])
    print(reportLink['link'])
    tableImageData = getSummaryTableFromReportUrl(reportLink['link'])
    reportPdfData = getPdfDataFromReportUrl(reportLink['link'])

  if reportPdfData:
    open('test.pdf', 'wb').write(reportPdfData)
    with tempfile.NamedTemporaryFile(suffix='.pdf') as temp:
      temp.write(reportPdfData)
      numbers = extractRecoveryNumbers(temp.name)
      [print(n) for n in numbers]
