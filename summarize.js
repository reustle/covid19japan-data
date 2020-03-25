const moment = require('moment')

const FetchPatientData = require('./src/fetch_patient_data.js')
const FetchDailySummary = require('./src/fetch_daily_summary.js')
const Summarize = require('./src/summarize.js')


const fetchAndSummarize = async (dateString) => {
  const patients = await FetchPatientData.fetchPatientData(`./docs/patient_data/${dateString}.json`)
  const daily = await FetchDailySummary.fetchDailySummary()
  const prefectures = await FetchDailySummary.fetchDailySummary()
  
  Summarize.summarize(patients, daily, prefectures, `./docs/summary/${dateString}.json`)
}

const dateString = moment().format('YYYY_MM_DD')
fetchAndSummarize(dateString)