// Fetches data.json directly from some repositories that follow the 
// Tokyo Metro stopcovid19 site implementation.

const _ = require('lodash')
const { translateRows } = require('./translation.js')

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


const fetchCovidJsonPatients = (url, keyPath) => {
  return fetchCovidJson(url, keyPath).then(patients => {
    if (!keyPath) {
      keyPath = 'patients.data'
    }
    return translateRows(_.get(patients, keyPath))
  })}

exports.fetchCovidJson = fetchCovidJson
exports.fetchCovidJsonPatients = fetchCovidJsonPatients
