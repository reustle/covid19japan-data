#!/usr/bin/python3
# -*- coding: utf-8 -*-

import sys
import re
import argparse
import pprint
import datetime

import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = '1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY'

def getPatientNumberColumn(sheet, tabProperties):
  patientNumbers = sheet.values().get(spreadsheetId=SPREADSHEET_ID, 
      range="'%s'!A:A" % (tabProperties['title'])).execute()

  patientNumbers = [row[0] for row in patientNumbers['values'] if row[0] != 'Existing']
  lastPatientNumber = patientNumbers[-1]

  isAlphaNumericPattern = re.match('([^\d]+)([0-9]+)', lastPatientNumber)
  if isAlphaNumericPattern:
    return (isAlphaNumericPattern.group(1), int(isAlphaNumericPattern.group(2)))
  return ('', int(lastPatientNumber))

def appendRows(sheet, tabProperties, prefecture,  count, date, deceased=False, source='', patientNumberPrefix='', lastPatientNumber=0):

  patientNumber = lastPatientNumber
  rows = []
  deceasedValue =  'Deceased' if deceased else ''
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

def writePatients(tabName, prefecture, count, date, deceased, source):  
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
  patientNumberPrefix, lastPatientNumber = getPatientNumberColumn(sheet, tabProperties)
  result = appendRows(sheet, tabProperties, prefecture, count, date,  deceased, source, patientNumberPrefix, lastPatientNumber)
  pprint.pprint(result)



if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('prefecture')
  parser.add_argument('count', type=int)
  parser.add_argument('--tab', default='Patient Data')
  parser.add_argument('--deceased', action="store_true")
  parser.add_argument('--date', default=datetime.datetime.now().strftime('%Y-%m-%d'))
  parser.add_argument('--source', default='')
  args = parser.parse_args()

  tab = args.tab
  if args.prefecture in ('Aichi', 'Chiba', 'Fukuoka', 'Hokkaido', 'Kanagawa', 'Osaka', 'Saitama', 'Tokyo'):
    tab = args.prefecture

  writePatients(tab, args.prefecture, int(args.count), args.date, args.deceased, args.source)
