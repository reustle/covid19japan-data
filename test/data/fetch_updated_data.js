const fs = require('fs')
const path = require('path')
const FetchPatientData = require('../../src/fetch_patient_data.js')
const FetchSheet = require('../../src/fetch_sheet.js')

const latestSheetId = '1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY'
const patientListTabs = [
  { 
    sheetId: latestSheetId, 
    tabs: [
      'Patient Data', 
      'Aichi',
      'Chiba',
      'Fukuoka',
      'Hokkaido',
      'Kanagawa',
      'Osaka',
      'Saitama',
      'Tokyo' 
    ]
  }
]
FetchPatientData.fetchPatientDataFromSheets(patientListTabs)
  .then(allPatients => {
    fs.writeFileSync(path.join(__dirname, 'fetchPatientDataFromSheets.json'), JSON.stringify(allPatients, null, ' '))
  })
  .catch(error => {
    console.log(error)
  })

FetchSheet.fetchRows(latestSheetId, 'Sum By Day').then(result => fs.writeFileSync(path.join(__dirname, 'sumByDay.json'), JSON.stringify(result, null, ' ')))
FetchSheet.fetchRows(latestSheetId, 'Prefecture Data').then(result => fs.writeFileSync(path.join(__dirname, 'prefectureData.json'), JSON.stringify(result, null, ' ')))
FetchSheet.fetchRows(latestSheetId, 'Cruise Sum By Day').then(result => fs.writeFileSync(path.join(__dirname, 'cruiseSumByDay.json'), JSON.stringify(result, null, ' ')))
FetchSheet.fetchRows(latestSheetId, 'Recoveries').then(result => fs.writeFileSync(path.join(__dirname, 'recoveries.json'), JSON.stringify(result, null, ' ')))
