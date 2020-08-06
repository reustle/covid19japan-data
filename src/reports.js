// Extract reports out of patient data logs.
const fs = require('fs')
const _ = require('lodash')
const { report } = require('process')
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants')


const extractReportURLs = (inputFilename) => {

  const createReport = (url) => {
    return {
      url: url,
      patients: [],
      prefectureIds: [],
      cityIds: [],
      deaths: 0,
    }
  }

  return new Promise((resolve, reject) => {
    let sourceURLs = new Set()
    let prefectureURLs = new Set()
    let cityURLs = new Set()

    let reports = {}
    let reportByDate = []
    let patientData = JSON.parse(fs.readFileSync(inputFilename))
    for (let patient of patientData) {
      let url = null
      if (patient.sourceURL) {
        url = patient.sourceURL
        sourceURLs.add()
      }
      if (patient.prefectureSourceURL) {
        url = patient.prefectureSourceURL
        prefectureURLs.add(patient.prefectureSourceURL)
      }
      if (patient.citySourceURL) {
        url = patient.citySourceURL
        cityURLs.add(patient.citySourceURL)
      }

      if (url) {
        let report = reports[url]
        if (!report) {
          reports[url] = createReport(url)
          report = reports[url]
        } 

        let patientId = patient.patientId
        if (patient.prefecturePatientNumber) {
          patientId = patient.prefecturePatientNumber
          report.prefectureIds.push(patient.prefecturePatientNumber)
        }
        if (patient.cityPrefectureNumber) {
          patientId = patient.cityPrefectureNumber
          report.cityIds.push(patient.cityPrefectureNumber)
        }

        if (patient.patientId != -1) {
          report.patients.push(patientId)
        }
        report.reportDate = patient.dateAnnounced
        report.prefecture = patient.detectedPrefecture
        report.prefectureSourceURL = patient.prefectureSourceURL
        report.citySourceURL = patient.citySourceURL
        if (patient.sourceURL && !patient.sourceURL.match(/gov/)) {
          report.newsURL = patient.sourceURL
        }
      }

      let deathURL = patient.deathSourceURL
      if (deathURL) {
        let report = reports[deathURL]
        if (!report) {
          reports[deathURL] = createReport(deathURL)
          report = reports[deathURL]
        }
        report.prefecture = patient.detectedPrefecture

        let date = patient.dateAnnounced
        if (patient.deceasedDate) {
          date = patient.deceasedDate
        }
        report.reportDate = date

        if (patient.patientStatus == 'Deceased') {
          report.deaths += 1
        }
      }

    }
    resolve({
      sourceURLs: sourceURLs,
      prefectureURLs: prefectureURLs,
      cityURLs: cityURLs,
      reports: reports
    })
  })
}

const patientsRange = (patients) => {
  const patientIdPattern = new RegExp('([A-Za-z]+)\#([0-9\.]+)')
  if (patients.length < 1) {
    return patients
  }
  if (patients.length == 1) {
    return patients[0]
  }

  let groups = {}
  let placeId = ''
  for (let patient of patients) {
    let matches = patient.match(patientIdPattern)
    if (matches) {
      placeId = matches[1]
      if (groups[placeId]) {
        groups[placeId].push(matches[2])
      } else {
        groups[placeId] = [matches[2]]
      }
    }
  }

  let results = []
  for (let placeId of Object.keys(groups)) {
    let ids = groups[placeId]
    if (ids.length > 1) {
      const minId = Math.min(...ids)
      const maxId = Math.max(...ids)
      if (ids.length < maxId - minId + 1) {
        // If the range is not continous, we give up and list all ids.
        results.push(_.map(ids, i => `${placeId}#${i}`).join(','))
      } else {
        results.push(`${placeId}#${minId} - ${placeId}#${maxId}`)
      }
    } else if (ids.length == 1) {
      results.push(`${placeId}#${ids[0]}`)
    }
  }
  return results.join(',')
}

const main = () => {
  extractReportURLs('./docs/patient_data/latest.json')
    .then(results => {
      // for (let url of results.prefectureURLs) {
      //   console.log(url)
      // }
      for (let reportUrl of _.keys(results.reports)) {
        let report = results.reports[reportUrl]
        let output = {
          announceDate: report.reportDate,
          newsURL: report.newsURL,
          prefectureSourceURL: report.prefectureSourceURL,
          citySourceURL: report.prefectureSourceURL,
          prefectureIds: patientsRange(report.prefectureIds),
          cityIds: patientsRange(report.cityIds),
          confirmed: report.patients.length,
          deaths: report.deaths
        }
        console.log(output)
      }    
    })
}

main()