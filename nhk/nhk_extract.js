// Script to extract aggregate values from NHK and write them into 
// the Google Spreadsheet using the account that exists in
// covid19-credentials.json
//
// These credentials are a service account that is generated using
// these instructions:
//
// https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account

const fetch = require('node-fetch')
const path = require('path')

const { GoogleSpreadsheet } = require('google-spreadsheet')
const { DateTime, Interval } = require('luxon');
const { extractDailySummary, sortedPrefectureCounts, prefectureLookup } = require('../src/statusboard/nhk.js')

const SPREADSHEET_ID = '1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY';

const insertColumn = async (sheet, columnIndex) => {
  await sheet._makeSingleUpdateRequest('insertRange', 
  {
    range: {
      sheetId: sheet.sheetId, 
      startColumnIndex: columnIndex, 
      endColumnIndex: columnIndex + 1
    },
    shiftDimension: 'COLUMNS'
  })
}

const copyPasteColumn = async(sheet, fromColumnIndex, toColumnIndex) => {
  await sheet._makeSingleUpdateRequest('copyPaste', 
  {
    source: {
      sheetId: sheet.sheetId, 
      startColumnIndex: fromColumnIndex, 
      endColumnIndex: fromColumnIndex + 1
    },
    destination: {
      sheetId: sheet.sheetId, 
      startColumnIndex: toColumnIndex, 
      endColumnIndex: toColumnIndex + 1      
    },
    pasteType: 'PASTE_NORMAL',
    pasteOrientation: 'NORMAL'
  })  
}

const writeNhkSummary = async (credentialsJson, dateString, url, prefectureCounts, otherCounts) => {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
  await doc.useServiceAccountAuth(require(credentialsJson))
  await doc.loadInfo(); // loads document properties and worksheets

  const nhkSheet = doc.sheetsByTitle['NHK']
  await nhkSheet.loadCells('H1:H59')
  const dateCell = nhkSheet.getCellByA1('H1')
  const linkCell = nhkSheet.getCellByA1('H2')

  const mysteriousDayOffset = 2 // dunno why 2 days are missing between 1900-1970
  let sheetsStartDate = DateTime.fromISO('1900-01-01')
  let newCellDate = DateTime.fromISO(dateString)
  let interval = Interval.fromDateTimes(sheetsStartDate, newCellDate)
  // console.log('Current Value', dateCell.formattedValue, dateCell.value)
  // console.log('Calculated Value', cellDate.toISODate())
  // console.log(interval.length('days') + 2)
  let dateValue = mysteriousDayOffset + interval.length('days')
  if (dateValue > dateCell.value) {
    // If the date to write it larger than the current value,
    // insert column and copy old values to the new column.
    insertColumn(nhkSheet, 8)
    copyPasteColumn(nhkSheet, 7, 8)
  }

  // Update cells.
  dateCell.value = dateValue
  linkCell.forumla = `=HYPERLINK("${url}", "Link")`
  console.log(linkCell.forumla)

  for (let i = 0; i < prefectureCounts.length; i++) {
    let cell = nhkSheet.getCell(3 + i, 7)
    cell.value = prefectureCounts[i]
  }
  
  for (let i = 0; i < otherCounts.length; i++) {
    let cell = nhkSheet.getCell(50 + i, 7)
    cell.value = otherCounts[i]
  }

  await nhkSheet.saveUpdatedCells()

}

const main = () => {
  // let url = 'https://www3.nhk.or.jp/news/html/20200411/k10012381781000.html?utm_int=detail_contents_news-related_002'
  // if (process.argv[2]) {
  //   url = process.argv[2]
  //   console.log(url)
  // }

  const credentials= path.join(__dirname, '../credentials.json')
  let url = 'https://www3.nhk.or.jp/news/html/20201218/k10012771511000.html'

  extractDailySummary(url, fetch)
    .then(values => {
      let prefectureCounts = sortedPrefectureCounts(values)
      let dateString = '2020-12-18'
      let otherCounts = [
        values.portQuarantineCount,
        values.critical,
        values.deceased,
        values.recoveredJapan,
        values.recoveredTotal
      ]
      writeNhkSummary(credentials, dateString, url, prefectureCounts, otherCounts)
    })
}

main()

