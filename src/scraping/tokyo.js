const fetch = require('node-fetch')
const Papa = require('papaparse')
const _ = require('lodash')
const process = require('process')

const PATIENTS_CSV = 'https://stopcovid19.metro.tokyo.lg.jp/data/130001_tokyo_covid19_patients.csv'

const fetchCsv = (url) => {
  return fetch(url)
    .then(response => response.text())
    .then(body => {
     return Papa.parse(body, {header: true})
    })
   
}

const main = () => {
  let patientsStart = 2167
  fetchCsv(PATIENTS_CSV).then(patients => {
    for (let patient of patients.data) {
      let k = _.keys(patient)[0]
      let patientNumber = patient[k]
      if (patientNumber >= patientsStart) {
        let dateAnnounced = patient['公表_年月日']
        let age = patient['患者_年代']
        let gender = patient['患者_性別']
        if (gender == '男性') {
          gender = 'M'
        } else if (gender == '女性') {
          gender = 'F'
        } else {
          gender = ''
        }
        if (age == '10歳未満') {
          age = '0'
        } else if (age == '不明') {
          age = ''
        } else {
          age = age.replace('代', '')
        }
        console.log(`${dateAnnounced}\t${age}\t${gender}\t${patientNumber}`)
      }
    }
  })
  
}

main()

