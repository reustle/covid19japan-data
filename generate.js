const moment = require('moment')

const FetchPatientData = require('./src/fetch_patient_data.js')
const FetchDailySummary = require('./src/fetch_daily_summary.js')
const FetchPrefectureSummary = require('./src/fetch_prefecture_summary.js')
const FetchLastUpdated = require('./src/fetch_last_updated.js')
const Summarize = require('./src/summarize.js')


const fetchAndSummarize = async (dateString) => {
  const patients = await FetchPatientData.fetchPatientData(`./docs/patient_data/${dateString}.json`)
  const daily = await FetchDailySummary.fetchDailySummary()
  const prefectures = await FetchPrefectureSummary.fetchPrefectureSummary()
  const lastUpdated = await FetchLastUpdated.fetchLastUpdated()
  Summarize.summarize(patients, daily, prefectures, lastUpdated, `./docs/summary/${dateString}.json`)
}

// Add 540 = UTC+9 for JST.
const dateString = moment().utcOffset(540).format('YYYY-MM-DD')
fetchAndSummarize(dateString)