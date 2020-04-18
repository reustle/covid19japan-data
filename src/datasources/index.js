
const _ = require('lodash')
const { fetchCsv, fetchPatients } = require('./csv.js')
const { fetchCovidJson, fetchCovidJsonPatients } = require('./covidjson.js')
const { extractDailySummary, sortedPrefectureCounts, prefectureLookup } = require('./nhk.js')
const { sources } = require('./sources.js')

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
    row.appendChild(cell(patientIdPrefix + patient.patientId, 'patientId'))
  } else {
    row.appendChild(cell('', 'patientId'))
  }
  row.appendChild(cell(patient.dateAnnounced, 'dateAnnounced'))
  row.appendChild(cell(patient.dateAnnounced, 'dateAdded'))
  row.appendChild(cell(patient.age, 'age'))
  row.appendChild(cell(patient.gender, 'gender'))
  row.appendChild(cell(patient.residence, 'residence'))
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
  document.querySelector('#output-debug').value = JSON.stringify(patients, false, '  ')
  document.querySelector('#results').className = 'patients-results'
  let table = document.querySelector('table#patients-table tbody#patients-body')
  table.innerHTML = ''
  for (let patient of patients) {
    table.appendChild(patientRow(patient, patientIdPrefix))
  }
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

const updateSidebar = () => {
  const ul = document.querySelector('#sources ul#prefectures')
  for (let prefectureName of _.keys(sources)) {
    const prefectureInfo = sources[prefectureName]
    let format = ''
    if (prefectureInfo.patients) {
      format = prefectureInfo.patients.format
    }

    const li = document.createElement('li')
    const patientLink = document.createElement('a')
    patientLink.href = '#'
    patientLink.innerHTML = `${prefectureName}.${format}`
    patientLink.setAttribute('data-prefecture', prefectureName)
    patientLink.classList.add('patient-link')

    if (format == '') {
      patientLink.classList.add('missing')
    }

    if (prefectureInfo.patients) {
      patientLink.addEventListener('click', e => {
        _.map(document.querySelectorAll('.patient-link'), o => { return o.classList.remove('selected') })
        e.target.classList.add('selected')
        let prefectureName = e.target.getAttribute('data-prefecture')
        let prefectureInfo = sources[prefectureName]
        if (prefectureInfo && prefectureInfo.patients) {
          if (prefectureInfo.patients.format == 'csv') {
            fetchPatients(prefectureInfo.patients.url, prefectureInfo.patients.encoding, fetch).then(patients => {
              updatePatientsTable(patients, _.capitalize(prefectureName) + '#')
            })
          }  else if (prefectureInfo.patients.format == 'json') {
            fetchCovidJsonPatients(prefectureInfo.patients.url, prefectureInfo.patients.key).then(patients => {
              updatePatientsTable(patients, _.capitalize(prefectureName) + '#')
            })
          }
        }
      })
    }

    const patientSourceLink = document.createElement('a')
    patientSourceLink.href = prefectureInfo.source
    patientSourceLink.target = '_blank'
    patientSourceLink.innerText = 'src'
    const patientDashboardLink = document.createElement('a')
    patientDashboardLink.href = prefectureInfo.dashboard
    patientDashboardLink.target = '_blank'
    patientDashboardLink.innerText = 'dash'


    const altInfo = document.createElement('span')
    altInfo.classList.add('alt-info')
    altInfo.appendChild(document.createTextNode('('))
    altInfo.appendChild(patientSourceLink)
    altInfo.appendChild(document.createTextNode(','))
    altInfo.appendChild(patientDashboardLink)
    altInfo.appendChild(document.createTextNode(')'))

    li.appendChild(patientLink)
    li.appendChild(altInfo)

    ul.appendChild(li)
  }
}

const main = () => {
  updateSidebar()

  document.querySelector('#nhk-daily').addEventListener('click', e => {
    let url = 'https://www3.nhk.or.jp/news/html/20200417/k10012392361000.html'
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