const fs = require('fs')
const moment = require('moment')
const _ = require('lodash')

const FetchPatientData = require('./src/fetch_patient_data.js')
const Summarize = require('./src/summarize.js')
const FetchSheet = require('./src/fetch_sheet.js')
const MergePatients = require('./src/merge_patients.js')

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
  const daily = await FetchSheet.fetchRows('Sum By Day')
  const prefectures = await FetchSheet.fetchRows('Prefecture Data')

  // Merge multiple patient lists.
  const patientListFetches = [
    FetchPatientData.fetchPatientData('Patient Data'),
    FetchPatientData.fetchPatientData('Tokyo'),
    FetchPatientData.fetchPatientData('Osaka'),
    FetchPatientData.fetchPatientData('Kanagawa'),
    FetchPatientData.fetchPatientData('Aichi'),
    //FetchPatientData.fetchPatientData('Chiba'),
  ]

  Promise.all(patientListFetches)
    .then(patientLists => {
      let patients = MergePatients.mergePatients(patientLists)
      console.log(`Total patients fetched: ${patients.length}`)

      generateLastUpdated(patients)
        .then(lastUpdated => {
          // Write patient data
          const patientOutputFilename = `./docs/patient_data/${dateString}.json`
          fs.writeFileSync(patientOutputFilename, JSON.stringify(patients, null, '  '))

          // Generate and write summary to JSON.
          const summary = Summarize.summarize(patients, daily, prefectures, lastUpdated)
          const summaryOutputFilename = `./docs/summary/${dateString}.json`
          fs.writeFileSync(summaryOutputFilename, JSON.stringify(summary, null, '  '))
          console.log('Success.')
        })     
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
