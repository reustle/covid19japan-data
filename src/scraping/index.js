
const _ = require('lodash')
const { fetchCsv, fetchPatients } = require('./csv.js')
const { extractDailySummary, sortedPrefectureCounts, prefectureLookup } = require('./nhk.js')
const { sources } = require('./sources.js')

const cell = (contents, className) => {
  let cell = document.createElement('td')
  cell.innerHTML = contents
  cell.classList.add(className)
  return cell
}

const patientRow = (patient, patientIdPrefix) => {
  if (!patientIdPrefix) {
    patientIdPrefix = ''
  }
  let row = document.createElement('tr')
  row.appendChild(cell(patientIdPrefix + patient.patientId, 'patientId'))
  row.appendChild(cell(patient.dateAnnounced, 'dateAnnounced'))
  row.appendChild(cell(patient.dateAnnounced, 'dateAdded'))
  row.appendChild(cell(patient.age, 'age'))
  row.appendChild(cell(patient.gender, 'gender'))
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
  document.querySelector('#results').className = 'patients-results'
  let table = document.querySelector('table#patients-table tbody#patients-body')
  table.innerHTML = ''
  for (let patient of patients) {
    table.appendChild(patientRow(patient, patientIdPrefix))
  }
  document.querySelector('#output-debug').value = JSON.stringify(patients, false, '  ')
}

const updateNHKTable = (values, url) => {
  document.querySelector('#results').className = 'nhk-results'
  document.querySelector('#nhk-url').value = url

  let table = document.querySelector('table#nhk-table')
  table.innerHTML = ''
  let sortedCounts = sortedPrefectureCounts(values)
  for (let count of sortedCounts) {
    let row = document.createElement('tr')
    let cell = document.createElement('td')
    cell.innerText = count
    row.appendChild(cell)
    table.appendChild(row)
  }

  document.querySelector('#output-debug').value = JSON.stringify(values, false, '  ')

}

const main = () => {
  document.querySelector('#tokyo-patients').addEventListener('click', e => {
    fetchPatients(sources.tokyo.patients.url, fetch).then(patients => {
      updatePatientsTable(patients, 'Tokyo#')
    })
  })

  document.querySelector('#fukui-patients').addEventListener('click', e => {
    fetchPatients(sources.fukui.patients.url, fetch).then(patients => {
      updatePatientsTable(patients, 'Fukui#')
    })
  })

  document.querySelector('#nhk-daily').addEventListener('click', e => {
    let url = 'https://www3.nhk.or.jp/news/html/20200415/k10012387851000.html'
    extractDailySummary(url).then(values => {
      updateNHKTable(values, url)
    })
  })

  document.querySelector('#nhk-url').addEventListener('blur', e => {
    let url = e.target.value
    extractDailySummary(url).then(values => {
      updateNHKTable(values, url)
    })
  })


  for (let button of document.querySelectorAll('.column-toggle')) {
    button.addEventListener('click', toggleColumn)
  }
  for (let button of document.querySelectorAll('.column-filter')) {
    button.addEventListener('blur', filterRows)
  }

}

window.addEventListener('load', main)