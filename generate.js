const fs = require('fs')
const moment = require('moment')

const FetchPatientData = require('./src/fetch_patient_data.js')
const FetchDailySummary = require('./src/fetch_daily_summary.js')
const FetchPrefectureSummary = require('./src/fetch_prefecture_summary.js')
const FetchLastUpdated = require('./src/fetch_last_updated.js')
const Summarize = require('./src/summarize.js')

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
        console.log(`Pulling lastUpdated from summary/latest.json: ${lastUpdated}`)
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
  const daily = await FetchDailySummary.fetchDailySummary()
  const prefectures = await FetchPrefectureSummary.fetchPrefectureSummary()
  const patients = await FetchPatientData.fetchPatientData()

  // Work out lastUpdated.
  const lastUpdated = await generateLastUpdated(patients)
  console.log(`Last updated: ${lastUpdated}`)

  // Write patient data
  const patientOutputFilename = `./docs/patient_data/${dateString}.json`
  fs.writeFileSync(patientOutputFilename, JSON.stringify(patients, null, '  '))

  // Generate and write summary to JSON.
  const summary = Summarize.summarize(patients, daily, prefectures, lastUpdated)
  const summaryOutputFilename = `./docs/summary/${dateString}.json`
  fs.writeFileSync(summaryOutputFilename, JSON.stringify(summary, null, '  '))
}

// Add 540 = UTC+9 for JST.
const dateString = moment().utcOffset(540).format('YYYY-MM-DD')
fetchAndSummarize(dateString)