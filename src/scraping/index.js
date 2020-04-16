
const _ = require('lodash')
const { fetchCsv, fetchPatients } = require('./csv.js')
const { sources } = require('./sources.js')

const main = () => {
  document.querySelector('#pull-tokyo').addEventListener('click', e => {
    fetchPatients(sources.tokyo.patients.url, fetch).then(patients => {
      let outputField = document.querySelector('textarea#output')
      let output = ''
      for (let patient of patients) {
        output += `${patient.dateAnnounced}\t${patient.age}\t${patient.gender}\n`
      }
      outputField.value = output
    })
  })
}

window.addEventListener('load', main)