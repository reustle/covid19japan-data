const moment = require('moment')

const fetch_patient_data = require('./src/fetch_patient_data.js')
const dateString = moment().format('YYYY_MM_DD')
fetch_patient_data.run(`./patient_data/${dateString}.json`)

