
const _ = require('lodash')
const moment = require('moment')
const { fetchCsv, fetchPatients } = require('./csv.js')
const { fetchCovidJson, fetchCovidJsonPatients } = require('./covidjson.js')
const { fetchFukushimaPatients } = require('./fukushima.js')
const { sources } = require('./sources.js')

const todayString = moment().format('YYYY-MM-DD')
const lastWeek = moment().subtract(7, 'days')

let _recentOnly = true;
let _cachedPatients = null;
let _currentPrefectureId = ''

const fetchPatientsForPrefecture = (prefectureId) => {
  let prefectureInfo = sources[prefectureId.toLowerCase()]
  console.log(sources)
  if (prefectureInfo && prefectureInfo.patients) {
    if (prefectureInfo.patients.format == 'csv') {
      fetchPatients(prefectureInfo.patients.url, prefectureInfo.patients.encoding, fetch)
        .then(patients => {
          _cachedPatients = patients
          updatePatientsTable(patients, _.capitalize(prefectureId) + '#')
        })
    }  else if (prefectureInfo.patients.format == 'json') {
      fetchCovidJsonPatients(prefectureInfo.patients.url, prefectureInfo.patients.key)
        .then(patients => {
          _cachedPatients = patients
          updatePatientsTable(patients, _.capitalize(prefectureId) + '#')
        })
    } else if (prefectureId == 'fukushima') {
      fetchFukushimaPatients(prefectureInfo.patients.url, prefectureInfo.patients.encoding, fetch)
        .then(patients => {
          _cachedPatients = patients
          updatePatientsTable(patients, _.capitalize(prefectureId) + '#')
        })
    }
  }
}

// Initialize patient fetch from the URL.
const fetchFromLocationHref = () => {
  let hash = window.location.hash
  if (hash) {
    hash = hash.slice(1)  // remove hash
  }

  console.log(hash)

  if (hash) {
    document.querySelector('#prefecture-header').innerText = hash
    _currentPrefectureId = hash
    fetchPatientsForPrefecture(hash)
  }
}

const cell = (contents, className) => {
  let cell = document.createElement('td')
  if (contents) {
    cell.innerHTML = contents
  }
  cell.classList.add(className)
  return cell
}

const patientRow = (patient, patientIdPrefix) => {
  if (!patientIdPrefix) {
    patientIdPrefix = ''
  }
  let row = document.createElement('tr')

  if (patient.patientId) {
    row.appendChild(cell(patientIdPrefix + patient.patientId, 'prefectureId'))
  } else {
    row.appendChild(cell('&nbsp;', 'prefectureId'))
  }
  row.appendChild(cell('&nbsp;', 'cityId'))
  row.appendChild(cell(patient.dateAnnounced, 'dateAnnounced'))
  row.appendChild(cell(todayString, 'dateAdded'))
  row.appendChild(cell(patient.age, 'age'))
  row.appendChild(cell(patient.gender, 'gender'))
  row.appendChild(cell(patient.residence, 'residence'))
  row.appendChild(cell('&nbsp;', 'testedCity'))

  return row
}

const toggleColumn = (e) => {
  let columnName = e.target.getAttribute('data-name')
  let table = document.querySelector('#patients-table')
  table.classList.toggle('hide-' + columnName)
  e.preventDefault()
  return false
}

const filterRows = (e) => {
  let filters = []
  for (let filterBox of document.querySelectorAll('.column-filter')) {
    if (filterBox.value && filterBox.value.length) {
      filters.push({columnName: filterBox.name, matchString: filterBox.value})
    }
  }
  let rows = document.querySelectorAll('table#patients-table tbody#patients-body tr')
  for (let row of rows) {
    let hasMatch = (filters.length == 0)
    for (let filter of filters) {
      let cell = row.querySelector(`td.${filter.columnName}`)
      if (cell.innerText.match(filter.matchString)) {
        hasMatch = true
      }
    }

    if (hasMatch) {
      row.classList.remove('hide')
    } else {
      row.classList.add('hide')
    }
  }
}

const updatePatientsTable = (patients, patientIdPrefix) => {
  document.querySelector('#console').value = JSON.stringify(patients, false, '  ')
  document.querySelector('#results').className = 'patients-results'
  let table = document.querySelector('table#patients-table tbody#patients-body')
  table.innerHTML = ''
  for (let patient of patients) {
    if (_recentOnly) {
      let dateAnnounced = moment(patient.dateAnnounced)
      if (dateAnnounced &&  dateAnnounced.isBefore(lastWeek)) {
        continue;
      }
    }
    table.appendChild(patientRow(patient, patientIdPrefix))
  }
}

const initConsole = () => {
  document.querySelector('#toggle-console').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector('#console-panel').classList.toggle('collapsed');
  })
}



const main = () => {
  initConsole()
  fetchFromLocationHref()
  for (let button of document.querySelectorAll('.column-toggle')) {
    button.addEventListener('click', toggleColumn)
  }
  for (let button of document.querySelectorAll('.column-filter')) {
    button.addEventListener('blur', filterRows)
  }

  document.querySelector('#toggle-recent').addEventListener('click', e => {
    _recentOnly = !_recentOnly;
    updatePatientsTable(_cachedPatients,  _.capitalize((_currentPrefectureId) + '#'))
  })

}

window.addEventListener('load', main)