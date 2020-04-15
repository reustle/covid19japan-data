const fetch = require('node-fetch')
const Papa = require('papaparse')

const PATIENTS_CSV = 'https://www.pref.fukui.lg.jp/doc/toukei-jouhou/covid-19_d/fil/covid19_patients.csv'
const PCR_CSV = 'https://www.pref.fukui.lg.jp/doc/toukei-jouhou/covid-19_d/fil/covid19_test_count.csv'

const fetchCsv = (url) => {
  return fetch(url)
    .then(response => response.text())
    .then(body => {
     return Papa.parse(body, {header: true})
    })
   
}

fetchCsv(PATIENTS_CSV).then(patients => {
  console.log(patients.data.slice(-2))
})

fetchCsv(PCR_CSV).then(pcr => {
  console.log(pcr.data)
})
