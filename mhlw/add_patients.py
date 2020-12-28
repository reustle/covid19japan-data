#!/usr/bin/python3
# -*- coding: utf-8 -*-
"""
Adds patients to the COVID19Japan spreadsheet.

Credentials use a service account credentials that are created using
these instructions and places in credentials.json:

https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account
"""

import sys
import re
import argparse
import pprint
import datetime
import urllib.parse

from googleapiclient.discovery import build
from google.oauth2 import service_account
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = '1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY'

PREFECTURE_PREFIX = {
  "Aichi": "AC",
  "Akita": "AK",
  "Aomori": "AM",
  "Chiba": "CHB",
  "Ehime": "EH",
  "Fukui": "FKI",
  "Fukuoka": "FK",
  "Fukushima": "FKS",
  "Gifu": "GF",
  "Gunma": "GM",
  "Hiroshima": "HRS",
  "Hokkaido": "HKD",
  "Hyogo": "HY",
  "Ibaraki": "IB",
  "Ishikawa": "ISK",
  "Iwate": "IW",
  "Kagawa": "KGW",
  "Kagoshima": "KGS",
  "Kanagawa": "KNG",
  "Kochi": "KC",
  "Kumamoto": "KM",
  "Kyoto": "KYT",
  "Mie": "ME",
  "Miyagi": "MYG",
  "Miyazaki": "MYZ",
  "Nagano": "NGN",
  "Nagasaki": "NGS",
  "Nara": "NR",
  "Niigata": "NGT",
  "Oita": "OIT",
  "Okayama": "OKY",
  "Okinawa": "OKN",
  "Osaka": "OSK",
  "Saga": "SG",
  "Saitama": "STM",
  "Shiga": "SG",
  "Shimane": "SM",
  "Shizuoka": "SZ",
  "Tochigi": "TCG",
  "Tokushima": "TKS",
  "Tokyo": "TOK",
  "Tottori": "TTR",
  "Toyama": "TY",
  "Wakayama": "WKY",
  "Yamagata": "YGT",
  "Yamaguchi": "YGC",
  "Yamanashi": "YNS",
  "Port Quarantine": "PRT"
}

def getPatientNumberColumn(sheet, tabProperties):
  patientNumbers = sheet.values().get(spreadsheetId=SPREADSHEET_ID, 
      range="'%s'!A:A" % (tabProperties['title'])).execute()

  patientNumbers = [row[0] for row in patientNumbers['values'] if row[0] != 'Existing']
  lastPatientNumber = patientNumbers[-1]

  isAlphaNumericPattern = re.match('([^\d]+)([0-9]+)', lastPatientNumber)
  if isAlphaNumericPattern:
    return (isAlphaNumericPattern.group(1), int(isAlphaNumericPattern.group(2)))
  return ('', int(lastPatientNumber))

def appendRows(sheet, tabProperties, prefecture, count, date, deceased=False, source='', patientNumberPrefix='', lastPatientNumber=0, useCountColumn=False):
  patientNumber = lastPatientNumber
  rows = []
  deceasedValue =  'Deceased' if deceased else ''

  if useCountColumn:
    rows.append([
        'Existing' if deceased else '%s%d' % (patientNumberPrefix, patientNumber),
        '',
        '',
        date,
        date,
        '',  # age
        '',  # gender
        '',  # city
        '',  # detectedCity
        prefecture,
        'Deceased' if deceased else '',
        count,
        '',
        source
    ])
  else:
    for i in range(count):
      patientNumber += 1
      rows.append([
        'Existing' if deceased else '%s%d' % (patientNumberPrefix, patientNumber),
        '',
        '',
        date,
        date,
        '',  # age
        '',  # gender
        '',  # city
        '',  # detectedCity
        prefecture,
        'Deceased' if deceased else '',
        '',
        '',
        source
      ])
    pprint.pprint(rows)

  return sheet.values().append(
    spreadsheetId=SPREADSHEET_ID, 
    range="'%s'!A:E" % (tabProperties['title']),
    valueInputOption='USER_ENTERED',
    insertDataOption='INSERT_ROWS',
    includeValuesInResponse=True,
    responseValueRenderOption='FORMATTED_VALUE',
    body={'majorDimension': 'ROWS', 'values': rows}).execute()

def writePatients(tabName, prefecture, count, date, deceased, source, useCountColumn):  
  creds = service_account.Credentials.from_service_account_file(
    './credentials.json', scopes=SCOPES
  )
  service = build('sheets', 'v4', credentials=creds)
  sheet = service.spreadsheets()

  sheetsResult = sheet.get(spreadsheetId=SPREADSHEET_ID, fields='sheets.properties').execute()
  tabProperties = {}
  for sheetProperty in sheetsResult['sheets']:
    if sheetProperty['properties']['title'] == tabName:
      tabProperties = sheetProperty['properties']
      break

  if not tabProperties:
    print('Unable to find tab: %s' % tabName)
    return

  pprint.pprint(tabProperties)
  if useCountColumn:
    patientNumberPrefix, lastPatientNumber = PREFECTURE_PREFIX[prefecture], int(date.replace('-', ''))
  else:
    patientNumberPrefix, lastPatientNumber = getPatientNumberColumn(sheet, tabProperties)

  result = appendRows(sheet, tabProperties, prefecture, count, date, 
    deceased = deceased, 
    source = source, 
    patientNumberPrefix = patientNumberPrefix, 
    lastPatientNumber = lastPatientNumber,
    useCountColumn = useCountColumn)
  pprint.pprint(result)



if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('prefecture')
  parser.add_argument('count', type=int)
  parser.add_argument('--tab', default='Patient Data')
  parser.add_argument('--deaths', action="store_true")
  parser.add_argument('--date', default=datetime.datetime.now().strftime('%Y-%m-%d'))
  parser.add_argument('--source', default='')
  parser.add_argument('--use-count-column', action=argparse.BooleanOptionalAction, default=True)
  args = parser.parse_args()

  tab = args.tab
  if args.prefecture in ('Aichi', 'Chiba', 'Fukuoka', 'Hokkaido', 'Kanagawa', 'Osaka', 'Saitama', 'Tokyo'):
    tab = args.prefecture

  if args.source:
    url = urllib.parse.urlsplit(args.source)
    args.source = urllib.parse.urlunsplit((url.scheme, url.netloc, url.path, None, None))

  writePatients(tab, args.prefecture, int(args.count), args.date, args.deaths, args.source, args.use_count_column)
