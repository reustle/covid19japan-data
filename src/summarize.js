// Summarizes data for site.
const fs = require('fs')
const _ = require('lodash')
const moment = require('moment')


// Merge all the data from the spreadsheet with auto-calculation
const summarize = (patientData, manualDailyData, manualPrefectureData, summaryOutputFilename) => {
  const patients = _.orderBy(patientData, ['dateAnnounced'], ['asc'])
  let prefectureSummary = generatePrefectureSummary(patients, manualPrefectureData)
  let dailySummary = generateDailySummary(patients, manualDailyData)

  let summary = {
    prefectures: prefectureSummary,
    daily: dailySummary
  }

  fs.writeFileSync(summaryOutputFilename, JSON.stringify(summary, null, '  '))
}

// Helper method to do parseInt safely (reverts to 0 if unparse)
const safeParseInt = v => {
  let result = parseInt(v)
  if (isNaN(result)) {
    return 0
  }
  return result
}

// Generates the daily summary
const generateDailySummary = (patients, manualDailyData) => {
  let dailySummary = {}
  for (let patient of patients) {
    let prefectureName = patient.detectedPrefecture
    let dateAnnounced = patient.dateAnnounced
    if (!dailySummary[dateAnnounced]) {
      dailySummary[dateAnnounced] = {
        confirmed: 0,
        recovered: 0,
        deceased: 0,
        critical: 0,
        tested: 0
      }
    }

    dailySummary[dateAnnounced].confirmed += 1
  }

  // merge manually sourced data
  // TODO: deceased, critical should be pulled out of our patient
  //       data. But those numbers are incomplete.
  for (let row of manualDailyData) {
    if (dailySummary[row.date]) {
      dailySummary[row.date].recovered = safeParseInt(row.recovered)
      dailySummary[row.date].deceased = safeParseInt(row.deceased)
      dailySummary[row.date].critical = safeParseInt(row.critical)
      dailySummary[row.date].tested = safeParseInt(row.tested)
    }
  }

  return _.map(_.sortBy(_.toPairs(dailySummary), a => a[0]), (v) => { let o = v[1]; o.date = v[0]; return o })
}

const generatePrefectureSummary = (patients, manualPrefectureData) => {
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
  appendSparkLineForAllPrefectures(patients, prefectureSummary)

  // Import manual data.
  for (let row of manualPrefectureData) {
    if (prefectureSummary[row.prefecture]) {
      prefectureSummary[row.prefecture].recovered = safeParseInt(row.recovered)
      prefectureSummary[row.prefecture].deaths = safeParseInt(row.deaths)
      prefectureSummary[row.prefecture].name_ja = row.prefectureja
    }
  }

  // Strip out patients list
  prefectureSummary = _.mapValues(prefectureSummary, (v, k) => { 
    delete v['patients']
    return v
  })

  return _.map(
    _.reverse(
      _.sortBy(
        _.toPairs(prefectureSummary), 
        [ a => a[1].count ])),
    (v) => { return {'name': v[0], 'summary': v[1]} }
  )
}

const generateSparkLineForPrefecture = (patients, firstDay, summary) => {
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
  const firstDay = moment('2020-01-08')
  for (let prefectureName in prefectureSummaries) {
    let summary = prefectureSummaries[prefectureName]
    summary.sparkLine = generateSparkLineForPrefecture(patients, firstDay, summary)
    summary.sparkLineStartDate = firstDay.format('YYYY-MM-DD')
  }
}

exports.summarize = summarize;

