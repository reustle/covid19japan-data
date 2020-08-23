const fs = require('fs')
const _ = require('lodash')
const Papa = require('papaparse')
const verify = require('./src/verify.js')
const FetchSheet = require('./src/fetch_sheet.js')
const FetchPatient = require('./src/fetch_patient_data.js')

let summary = JSON.parse(fs.readFileSync('docs/summary/latest.json'))
verify.verifyDailySummary(summary.daily)
console.log(summary.daily[summary.daily.length - 1])

const fieldMask = 'spreadsheetId,properties,sheets.properties,sheets.data.rowData.values(effectiveValue,formattedValue,effectiveFormat.hyperlinkDisplayType,hyperlink)'

const sheetsAndTabs = [
  {sheetId: '1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY', tabs: ['Patient Data', 'Aichi']}
]

// FetchPatient.fetchPatientDataFromSheets(sheetsAndTabs)
//   .then(patients => {
//     console.log(patients)
//   })

// FetchSheet.fetchSheets(sheetsAndTabs, fieldMask)
//   .then((responses) => {
//     for (let sheetsResponse of responses) {
// //      console.log(sheetsResponse)
//     }
//   })
//   .catch((err) => {
//     console.error(err)
//   })
