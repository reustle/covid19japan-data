const fs = require('fs')
const _ = require('lodash')

const existingPatientsData = fs.readFileSync(`./docs/patient_data/latest.json`)
const existingPatients = JSON.parse(existingPatientsData)
const osakaPatients = _.filter(existingPatients, o => { return o.detectedPrefecture == 'Tokyo' && o.patientStatus == 'Deceased' })
console.log(_.sortBy(_.map(osakaPatients, o => { return [o.dateAnnounced, o.deceasedDate] })))
console.log(`Count: ${osakaPatients.length}`)
