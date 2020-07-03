// Fetches CSV file from various open data sources.

const Papa = require('papaparse')
const _ = require('lodash')
const { translateRows } = require('./translation.js')
const Encoding = require('encoding-japanese')
const { urlWithProxy } = require('./proxy.js')

const fetchCsv = (url, encoding, fetcher) => {
  let fetchUrl = urlWithProxy(url)
  if (!fetcher) {
    fetcher = fetch
  }

  return fetcher(fetchUrl)
    .then(response => {
      if (!encoding) {
        return response.text()
      }
      return response.arrayBuffer().then(arrayBuffer => {
        let nonUnicodeArray = new Uint8Array(arrayBuffer)
        let unicodeArray = Encoding.convert(nonUnicodeArray, 'UNICODE', encoding)
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
