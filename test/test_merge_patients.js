const fs = require('fs')
const path = require('path')
const expect = require('chai').expect

const MergePatients = require('../src/merge_patients.js')

const input = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/fetchPatientDataFromSheets.json')))

let patients = MergePatients.mergePatients(input)
expect(patients).to.have.lengthOf(63661)

