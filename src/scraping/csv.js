const Papa = require('papaparse')
const _ = require('lodash')
const jconv = require('jconv')
const { translateAge, translateGender } = require('./translation.js')
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
        console.log(sjisArray)
        console.log(Encoding.detect(sjisArray))
        let unicodeArray = Encoding.convert(sjisArray, 'UNICODE', 'SJIS')
        let unicodeString = Encoding.codeToString(unicodeArray)
        return unicodeString
       // return jconv.convert(buffer, 'SJIS', 'UTF8').toString()
      })
    })
    .then(body => {
      console.log(body)
     return Papa.parse(body, {header: true})
    })
}


const translateCsv = (rows) => {
  return _.map(rows, row => {
    let translated = {}
    for (let key of _.keys(row)) {
      if (key == 'No') {
        translated['patientId'] = row[key]
      } else if (key == '公表_年月日') {
        translated['dateAnnounced'] = row[key]
      } else if (key == '患者_年代' || key == '年代') {
        translated['age'] = translateAge(row[key])
      } else if (key == '患者_性別' || key == '性別') {
        translated['gender'] = translateGender(row[key])
      } else if (key == '居住地' || key == '患者_居住地')  {
        translated['residence'] = row[key]
      } else if (key == '発症_年月日') {
        translated['dateSymptomatic'] = row[key]
      } else if (key == '患者_職業') {
        translated['occupation'] = row[key]
      } else if (key == '患者_状態') {
        translated['condition'] = row[key]
      } else {
        translated[key] = row[key]
      }
    }
    return translated
  })
}

const fetchPatients = (url, encoding, fetcher) => {
  if (!fetcher) {
    fetcher = fetch
  }
  return fetchCsv(url, encoding, fetcher).then(patients => {
    return translateCsv(patients.data)
  })
}

exports.fetchPatients = fetchPatients
exports.fetchCsv = fetchCsv
exports.translateCsv = translateCsv
