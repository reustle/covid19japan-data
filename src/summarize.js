// Summarizes data for site.

const fs = require('fs')
const _ = require('lodash')
const moment = require('moment')

const summarize = (fetchPatientData, summaryOutputFilename) => {
  const patients = _.orderBy(JSON.parse(fs.readFileSync(patientDataFilename)), ['dateAnnounced'], ['asc'])
  let prefectureSummary = generatePrefectureSummary(patients)
  let dailySummary = generateDailySummary(patients)

  let summary = {
    prefectures: prefectureSummary,
    daily: dailySummary
  }

  fs.writeFileSync(summaryOutputFilename, JSON.stringify(summary, null, '  '))
}

const generateDailySummary = (patients) => {
  let dailySummary = {}
  for (let patient of patients) {
    let prefectureName = patient.detectedPrefecture
    let dateAnnounced = patient.dateAnnounced
    if (!dailySummary[dateAnnounced]) {
      dailySummary[dateAnnounced] = {
        infected: 0,
        deaths: 0,
      }
    }

    dailySummary[dateAnnounced].infected += 1
  }

  return dailySummary
}

const generatePrefectureSummary = (patients) => {
  let prefectureSummary = {}

  for (let patient of patients) {
    let prefectureName = patient.detectedPrefecture
    let cityName = patient.detectedCityTown

    if (!prefectureSummary[prefectureName]) {
      prefectureSummary[prefectureName] = {
        count: 0,
        cruisePassenger: 0,
        cruiseWorker: 0,
        deaths: 0,
        patients: [],
        progression: [],
        cityCounts: {}
      }
    
    }
    prefectureSummary[prefectureName].count += 1
    if (patient.cruisePassengerDisembarked == 1) {
      prefectureSummary[prefectureName].cruisePassenger += 1
    }
    if (patient.cruiseQuarantineOfficer == 1) {
      prefectureSummary[prefectureName].cruiseWorker += 1
    }
    if (patient.patientStatus == 'Deceased') {
      prefectureSummary[prefectureName].deaths += 1
    }
    if (cityName) {
      if (prefectureSummary[prefectureName].cityCounts[cityName]) {
        prefectureSummary[prefectureName].cityCounts[cityName] += 1
      } else {
        prefectureSummary[prefectureName].cityCounts[cityName] = 1        
      }
    }

    prefectureSummary[prefectureName].patients.push(patient)
  }

  // calculate sparkline array
  // appendSparkLineForAllPrefectures(patients, prefectureSummary)

  // Strip out patients list
  prefectureSummary = _.mapValues(prefectureSummary, (v, k) => { 
    delete v['patients']
    return v
  })

  return _.reverse(_.sortBy(_.toPairs(prefectureSummary), [ a => a[1].count ]))
}

const generateSparkLineForPrefecture = (patients, summary) => {
  const firstDay = moment('2020-01-08')
  const lastDay = moment(patients[patients.length - 1].dateAnnounced)
  let day = moment(firstDay)
  let sparkLineData = []
  while (day <= lastDay) {
    let dayString = day.format('YYYY-MM-DD')
    let reports = _.filter(summary.patients, o => { return o.dateAnnounced == dayString })
    sparkLineData.push(reports.length)
    day = day.add(1, 'days')
  }
  return sparkLineData
}

const appendSparkLineForAllPrefectures = (patients, prefectureSummaries) => {
  for (let prefectureName in prefectureSummaries) {
    let summary = prefectureSummaries[prefectureName]
    summary.sparkLine = generateSparkLineForPrefecture(patients, summary)
  }
}

exports.summarize = summarize;

