// Methods that are used to verify and fix any data issues before pushing.
const _ = require('lodash')

// Verification of the daily summary.
//
// @throws ValidationError if the data is not correct.
// @returns valid dailySummary.
const verifyDailySummary = (dailySummary) => {
  // Ensure there's some data.
  if (dailySummary.length < 10) {
    throw new Error(`DailySummaryError: Expecting more than 10 days of data.`)
  }

  // Ensure none of the fields are zero.
  let latestDay = dailySummary[dailySummary.length - 1]
  for (let key of Object.keys(latestDay)) {
    if (key.endsWith('Cumulative') && !key.match(/active/)) {
      if (latestDay[key] < 1) {
        throw new Error(`DailySummaryError: ${key} for the latest day is 0.`)
      }
    }
  }

  return dailySummary
}

const verifyPrefectures = (prefectures) => {
  for (let prefecture of prefectures) {
    if (prefecture.confirmed < prefecture.recovered) {
      throw new Error(`PrefectureError: ${prefecture.name} has more recovered than confirmed`)
    }
  }
  
}

const verifyPatients = (patients) => {
  // Ensure there are no duplicate patient Ids.
  let patientIds = {}
  let duplicates = []
  for (let patient of patients) {
    if (patient.patientId == -1) {
      continue
    }
    if (patientIds[patient.patientId]) {
      duplicates.push(patient.patientId)
    }
    patientIds[patient.patientId] = 1
  }

  if (duplicates.length > 0) {
    if (duplicates.length > 1000) {
      throw new Error(`PatientError: Duplicated patientIds detected: Total: ${duplicates.length}: First: ${duplicates[0]} `)
    } else {
      throw new Error(`PatientError: Duplicated patientIds detected: ${duplicates}: `)
    }
  }

  return patients
}

const verifyPatientLists = (patientLists) => {
  for (let patientList of patientLists) {
    if (patientList.length < 1) {
      throw new Error('PatientListError: Unexpected empty patient list')
    }
  }
  return patientLists
}


exports.verifyDailySummary = verifyDailySummary
exports.verifyPrefectures = verifyPrefectures
exports.verifyPatients = verifyPatients
exports.verifyPatientLists = verifyPatientLists