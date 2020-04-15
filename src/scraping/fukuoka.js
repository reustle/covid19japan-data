const fetch = require('node-fetch')
const Papa = require('papaparse')

const PATIENTS_CSV = 'https://ckan.open-governmentdata.org/dataset/8a9688c2-7b9f-4347-ad6e-de3b339ef740/resource/c27769a2-8634-47aa-9714-7e21c4038dd4/download/400009_pref_fukuoka_covid19_patients.csv'
const PCR_CSV = 'https://ckan.open-governmentdata.org/dataset/ef64c68a-d89e-4b1b-a53f-d2535ebfa3a1/resource/aab43191-40d0-4a6a-9724-a9030a596009/download/400009_pref_fukuoka_covid19_exam.csv'

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
