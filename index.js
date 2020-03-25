const moment = require('moment')

const FetchPatientData = require('./src/fetch_patient_data.js')
const Summarize = require('./src/summarize.js')


const dateString = moment().format('YYYY_MM_DD')
FetchPatientData.fetchPatientData(`./patient_data/${dateString}.json`)
  .then(patients => {
    Summarize.summarize(patients, `./summary/${dateString}.json`)
  })
  .catch(err => {
    console.error(err)
  })

