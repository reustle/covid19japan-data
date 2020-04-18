const Papa = require('papaparse')
const _ = require('lodash')
const { translateRows } = require('./translation.js')
const Encoding = require('encoding-japanese')

const USE_PROXY = true

const fetchCsv = (url, encoding, fetcher) => {
  let fetchUrl = url
  if (USE_PROXY) {
    // fetchUrl = 'http://localhost:3998/proxy?url=' +
    //   encodeURIComponent(url)
    fetchUrl = 'https://us-central1-covid19-analysis.cloudfunctions.net/proxy?url=' +
      encodeURIComponent(url)
  }
  if (!fetcher) {
    fetcher = fetch
  }

  return fetcher(fetchUrl)
    .then(response => {
      if (!encoding) {
        return response.text()
      }
      return response.arrayBuffer().then(arrayBuffer => {
        let sjisArray = new Uint8Array(arrayBuffer)
        let unicodeArray = Encoding.convert(sjisArray, 'UNICODE', 'SJIS')
        let unicodeString = Encoding.codeToString(unicodeArray)
        return unicodeString
      })
    })
    .then(body => {
     return Papa.parse(body, {header: true})
    })
}

const fetchPatients = (url, encoding, fetcher) => {
  if (!fetcher) {
    fetcher = fetch
  }
  return fetchCsv(url, encoding, fetcher).then(patients => {
    return translateRows(patients.data)
  })
}

exports.fetchPatients = fetchPatients
exports.fetchCsv = fetchCsv
exports.translateRows = translateRows
