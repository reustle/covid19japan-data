const Papa = require('papaparse')
const _ = require('lodash')
const USE_PROXY = true

const fetchCsv = (url, fetcher) => {
  let fetchUrl = url
  if (USE_PROXY) {
    fetchUrl = 'https://us-central1-covid19-analysis.cloudfunctions.net/proxy?url=' +
      encodeURIComponent(url)
  }
  if (!fetcher) {
    fetcher = fetch
  }
  return fetcher(fetchUrl)
    .then(response => response.text())
    .then(body => {
     return Papa.parse(body, {header: true})
    })
}

const translateAge = (age) => {
  if (age == '10歳未満') {
    return '0'
  } else if (age == '不明') {
    return ''
  } else {
    return age.replace('代', '')
  }
}

const translateGender = (gender) => {
  if (gender == '男性') {
    return 'M'
  } else if (gender == '女性') {
    return 'F'
  } else {
    return ''
  }
}

const translateCsv = (rows) => {
  return _.map(rows, row => {
    let translated = {}
    for (let key of _.keys(row)) {
      if (key == 'No') {
        translated['patientId'] = row[key]
      } else if (key == '公表_年月日') {
        translated['dateAnnounced'] = row[key]
      } else if (key == '患者_年代') {
        translated['age'] = translateAge(row['患者_年代'])
      } else if (key == '患者_性別') {
        translated['gender'] = translateGender(row['患者_性別'])
      } else {
        translated[key] = row[key]
      }
    }
    return translated
  })
}

const fetchPatients = (url, fetcher) => {
  if (!fetcher) {
    fetcher = fetch
  }
  return fetchCsv(url, fetcher).then(patients => {
    return translateCsv(patients.data)
  })
}

exports.fetchPatients = fetchPatients
exports.fetchCsv = fetchCsv
exports.translateCsv = translateCsv
