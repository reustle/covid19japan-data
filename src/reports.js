// Extract reports out of patient data logs.
const fs = require('fs')
const _ = require('lodash')
const Papa = require('papaparse')

const normalizeURL = (url) => {
  url = url.trim()
  if (url.match(/nhk/g)) {
    const pattern = new RegExp('^(http.*html)\?.*', 'iu')
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  return url
}

const extractReportURLs = (inputFilename) => {

  const createReport = (url) => {
    return {
      url: url,
      patients: [],
      prefecture: '',
      prefectureIds: [],
      cityIds: [],
      deathDates: [],
    }
  }

  return new Promise((resolve, reject) => {
    let sourceURLs = new Set()
    let prefectureURLs = new Set()
    let cityURLs = new Set()

    let reports = {}
    let patientData = JSON.parse(fs.readFileSync(inputFilename))
    for (let patient of patientData) {
      let url = 'unverified'
      if (patient.sourceURL) {
        url = normalizeURL(patient.sourceURL)
        sourceURLs.add(url)
      }
      if (patient.prefectureSourceURL) {
        url = patient.prefectureSourceURL
        prefectureURLs.add(url)
      }
      if (patient.citySourceURL) {
        url = patient.citySourceURL
        cityURLs.add(url)
      }

      let reportId = `${patient.dateAnnounced} ${patient.detectedPrefecture} ${url}`
      let report = reports[reportId]
      if (!report) {
        report = createReport(url)
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

      if (patient.prefectureSourceURL) {
        report.prefectureSourceURL = patient.prefectureSourceURL
      }
      if (patient.citySourceURL) {
        report.citySourceURL = patient.citySourceURL
      }
      if (patient.sourceURL && !patient.sourceURL.match(/gov/)) {
        report.newsURL = normalizeURL(patient.sourceURL)
      }

      report.reportDate = patient.dateAnnounced
      report.prefecture = patient.detectedPrefecture

      if (patient.patientStatus == 'Deceased') {
        let deathURL = 'unverified'
        if (patient.sourceURL) {
          deathURL = normalizeURL(patient.sourceURL)
        }
        if (patient.deathSourceURL) {
          deathURL = patient.deathSourceURL
        }

        let date = patient.dateAnnounced
        if (patient.deceasedDate) {
          date = patient.deceasedDate
        }
        if (patient.deceasedReportedDate) {
          date = patient.deceasedReportedDate
        }

        let deathDateId = `${date} ${patient.detectedPrefecture} ${deathURL}`
       
        let deathReport = reports[deathDateId]
        if (!deathReport) {
          deathReport = createReport(deathURL)
          reports[deathDateId] = deathReport 
        }
        deathReport.prefecture = patient.detectedPrefecture
        if (patient.deathSourceURL) {
          deathReport.deathSourceURL = patient.deathSourceURL
        }
     
        let deathDate = patient.dateAnnounced
        if (patient.deceasedDate) {
          deathDate = patient.deceasedDate
        }
        deathReport.deathDates.push(deathDate)
        if (patient.detectedPrefecture == 'Fukuoka') {
          console.log(deathDateId, deathReport.deathDates.length)
        }
      }

      // Only record this report if there is a patient added
      if (report.patients.length > 0 || report.deathDates.length > 0) {
        reports[reportId] = report
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
    return ''
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
      let groups = []
      for (let identifier of _.keys(results.reports)) {
        let report = results.reports[identifier]
        let group = {
          identifier: identifier,
          announceDate: report.reportDate,
          newsURL: report.newsURL,
          prefecture: report.prefecture,
          prefectureSourceURL: report.prefectureSourceURL,
          citySourceURL: report.citySourceURL,
          deathSourceURL: report.deathSourceURL,
          prefectureIds: patientsRange(report.prefectureIds),
          cityIds: patientsRange(report.cityIds),
          confirmed: report.patients.length,
          deaths: report.deathDates.length,
          deathDates: report.deathDates.join(',')
        }
        groups.push(group)
      }    

      groups = _.orderBy(groups, ['announceDate', 'prefecture'], ['asc', 'asc'])

      let csv = Papa.unparse(groups, {header: true, columns: [
        'announceDate',
        'prefecture',
        'confirmed',
        'deaths',
        'newsURL',
        'prefectureIds',
        'prefectureSourceURL',
        'cityIds',
        'citySourceURL',
        'deathDates',
        'deathSourceURL',
      ]})
      fs.writeFileSync('reports.csv', csv)
      fs.writeFileSync('reports.json', JSON.stringify(groups, null, ' '))
    })
}

main()