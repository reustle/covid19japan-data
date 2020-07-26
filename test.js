const fs = require('fs')
const _ = require('lodash')
const Papa = require('papaparse')
const verify = require('./src/verify.js')
const FetchSheet = require('./src/fetch_sheet.js')

// let summary = JSON.parse(fs.readFileSync('docs/summary/latest.json'))
// verify.verifyDailySummary(summary.daily)
// console.log(summary.daily[summary.daily.length - 1])

const fields = "sheets.data.rowData.values(effectiveValue,formattedValue,effectiveFormat.hyperlinkDisplayType,hyperlink)"

FetchSheet.fetchWithSheetsService('1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY', 'Patient Data', fields)
  .then((response) => {
    console.log(response.sheets)
    console.log(response.sheets[0].data[0].rowData[146].values)
  })
  .catch((err) => {
    console.error(err)
  })
