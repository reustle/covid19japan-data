const fs = require('fs')
const moment = require('moment')
const _ = require('lodash')

const FetchPatientData = require('./src/fetch_patient_data.js')
const Summarize = require('./src/summarize.js')
const FetchSheet = require('./src/fetch_sheet.js')
const MergePatients = require('./src/merge_patients.js')
const Prefectures = require('./src/prefectures.js')
const { request } = require('http')

const generateLastUpdated = async (patients) => {
  // Check if patient list changed size, if it did, then update lastUpdated
  let lastUpdated = null
  const existingPatientsData = fs.readFileSync(`./docs/patient_data/latest.json`)
  if (existingPatientsData) {
    const existingPatients = JSON.parse(existingPatientsData)
    if (existingPatients && existingPatients.length && existingPatients.length != patients.length) {
      // Add 540 = UTC+9 for JST.
      lastUpdated = moment().utcOffset(540).format()
      console.log(`Patients data updated. New: ${patients.length} Old: ${existingPatients.length}`)
    }
  }

  // Patient data didn't get updated, pull lastUpdate from the latest summary.
  if (lastUpdated == null) {
    const existingSummaryData = fs.readFileSync(`./docs/summary/latest.json`)
    if (existingSummaryData) {
      const existingSummary = JSON.parse(existingSummaryData)
      if (existingSummary && existingSummary.updated && typeof existingSummary.updated === 'string') {
        lastUpdated = existingSummary.updated
        //console.log(`Pulling lastUpdated from summary/latest.json: ${lastUpdated}`)
      }
    }
  }

  // If it's still null, we don't know. So just use the latest timestamp.
  if (lastUpdated == null) {
    lastUpdated = moment().utcOffset(540).format()
  }
  return lastUpdated
}

const fetchAndSummarize = async (dateString) => {
  const prefectureNames = Prefectures.prefectureNamesEn()
  const regions = Prefectures.regionPrefectures()

  const latestSheetId = '1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY'
  const daily = await FetchSheet.fetchRows(latestSheetId, 'Sum By Day')
  const prefectures = await FetchSheet.fetchRows(latestSheetId, 'Prefecture Data')
  const cruiseCounts = await FetchSheet.fetchRows(latestSheetId, 'Cruise Sum By Day')
  const recoveries = await FetchSheet.fetchRows(latestSheetId, 'Recoveries')

  const filterPatientForOutput = (patient) => {
    let filtered = Object.assign({}, patient)
    if (patient.ageBracket == -1) {
      delete filtered.ageBracket
    }
    delete filtered.patientCount
    return filtered
  }


  const mergeAndOutput = (allPatients) => {
    let patients = MergePatients.mergePatients(allPatients)
    console.log(`Total patients fetched: ${patients.length}`)

    generateLastUpdated(patients)
      .then(lastUpdated => {
        // Write patient data
        const patientOutputFilename = `./docs/patient_data/latest.json`
        const patientOutput = patients.map(filterPatientForOutput)
        fs.writeFileSync(patientOutputFilename, JSON.stringify(patientOutput))

        // Write daily and prefectural summary.
        const summary = Summarize.summarize(patients, daily, prefectures, cruiseCounts, recoveries, prefectureNames, regions, lastUpdated)
        const summaryOutputFilename = `./docs/summary/latest.json`
        fs.writeFileSync(summaryOutputFilename, JSON.stringify(summary, null, '  '))

        // Write minified version of daily/prefectural summary
        const summaryMinifiedOutputFilename = `./docs/summary_min/latest.json`
        fs.writeFileSync(summaryMinifiedOutputFilename, JSON.stringify(summary))

        console.log('Success.')
      })     
  }

  const tabsBatchSize = 6
  let tabs = [
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

  // Split tabs into requests with maximum tabBatchSize
  // to prevent response from being too long.
  const requests = []
  while (tabs.length > 0) {
    const thisRequestTabs = tabs.slice(0, tabsBatchSize)
    tabs = tabs.slice(tabsBatchSize)
    requests.push(FetchPatientData.fetchPatientDataFromSheets([{
      sheetId: latestSheetId,
      tabs: thisRequestTabs
    }]))
  }

  // Execute the requests.
  Promise.all(requests)
    .then(patientLists => {
      let allPatients = _.flatten(patientLists)
      mergeAndOutput(allPatients)
    })
    .catch(error => {
      console.log(error)
    })
}

const writePerPrefecturePatients = (prefectureName, allPatients, dateString) => {
    const lowercasePrefecture = _.camelCase(prefectureName)
    const prefecturePatientsFilename = `./docs/patients/${lowercasePrefecture}_${dateString}.json`
    const prefecturePatients = _.filter(patients, v => { return v.detectedPrefecture == prefectureName})
    fs.writeFileSync(prefecturePatientsFilename, JSON.stringify(prefecturePatients, null, '  '))
}

try {
  // Add 540 = UTC+9 for JST.
  const dateString = moment().utcOffset(540).format('YYYY-MM-DD')
  fetchAndSummarize(dateString)
} catch (e) {
  console.error(e)
}
