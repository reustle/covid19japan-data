const fs = require('fs')
const moment = require('moment')

const FetchPatientData = require('./src/fetch_patient_data.js')
const FetchDailySummary = require('./src/fetch_daily_summary.js')
const FetchPrefectureSummary = require('./src/fetch_prefecture_summary.js')
const FetchLastUpdated = require('./src/fetch_last_updated.js')
const Summarize = require('./src/summarize.js')

const fetchAndSummarize = async (dateString) => {
  const daily = await FetchDailySummary.fetchDailySummary()
  const prefectures = await FetchPrefectureSummary.fetchPrefectureSummary()
  const lastUpdated = await FetchLastUpdated.fetchLastUpdated()

  // Fetch and write patients data.
  const patients = await FetchPatientData.fetchPatientData()
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