const _ = require('lodash')
const { translateAge, translateGender } = require('./translation.js')

const USE_PROXY = true

const fetchCovidJson = (url) => {
  let fetchUrl = url
  if (USE_PROXY) {
    fetchUrl = 'https://us-central1-covid19-analysis.cloudfunctions.net/proxy?url=' +
      encodeURIComponent(url)
  }

  return fetch(fetchUrl)
    .then(response => response.json())
}

const translateCovidJson = (rows) => {
  return _.map(rows, row => {
    let translated = {}
    for (let key of _.keys(row)) {
      if (key == 'No') {
        translated['patientId'] = row[key]
      } else if (key == 'date' || key =='リリース日') {
        translated['dateAnnounced'] = row[key]
      } else if (key == '年代') {
        translated['age'] = translateAge(row[key])
      } else if (key == '性別') {
        translated['gender'] = translateGender(row[key])
      } else if (key == '居住地') {
        translated['residence'] = row[key]
      } else {
        translated[key] = row[key]
      }
    }
    return translated
  })
}

const fetchCovidJsonPatients = (url, keyPath) => {
  return fetchCovidJson(url, keyPath).then(patients => {
    if (!keyPath) {
      keyPath = 'patients.data'
    }
    return translateCovidJson(_.get(patients, keyPath))
    return translateCsv(patients.data)
  })}

fetchCovidJsonPatients

exports.fetchCovidJson = fetchCovidJson
exports.fetchCovidJsonPatients = fetchCovidJsonPatients
