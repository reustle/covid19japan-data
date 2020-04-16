const fetch = require('node-fetch')
const { fetchCsv, fetchPatients } = require('./index.js')
const { sources } = require('./sources.js')

fetchPatients(sources.fukui.patients.url, fetch).then(patients => {
  console.log(patients.slice(-2))
})

fetchCsv(sources.fukui.tests.url, fetch).then(pcr => {
  console.log(pcr)
})
