import _ from 'lodash'
import moment from 'moment'
import { div, span, tr, td, el } from 'quickelement'

const th = (klass, attributes, contents) => { return el('th', klass, attributes, contents ) } 

const _state = {
  maxDaysBefore: 30,
  selectedField: 'confirmed',
  patients: []
}

const cellWithValue = (klass, value) => {
  if (value != undefined && value != 0) { 
    return td(klass, `${value}`)
  } 
  return td(klass, '')
}

const render = () => {
  const table = document.querySelector('table#prefectures')
  const tableHead = table.querySelector('thead')
  const tableBody = table.querySelector('tbody')

  console.log(_state.prefectureSummary)

  tableHead.innerHTML = ''
  let columnHeaders = [
    th('', 'Prefecture'),
    th('', 'Total'),
  ]
  if (_state.selectedField == 'confirmed' || _state.selectedField == 'deceased') {
    let dates = _.map(_.range(0, _state.maxDaysBefore), i => { return moment().subtract(i, 'days').format('M/DD') })
    console.log(_.range(0, _state.maxDaysBefore))
    columnHeaders = _.concat(columnHeaders, _.map(dates, date => th('', date)))
  }
  tableHead.appendChild(tr('', columnHeaders))

  tableBody.innerHTML = ''
  for (let prefecture of _state.prefectureSummary) {
    let cells = [cellWithValue('prefectureName', prefecture.name)]
    cells.push(cellWithValue(_state.selectedField, prefecture[_state.selectedField]))

    if (_state.selectedField == 'confirmed' || _state.selectedField == 'deceased') {
      let fieldName = `daily${_.capitalize(_state.selectedField)}Count`
      let dailyValues = prefecture[fieldName]
      for (let daysAgo of _.range(0, _state.maxDaysBefore)) {
        let val = parseInt(dailyValues[dailyValues.length - 1 - daysAgo])
        cells.push(cellWithValue('', val))
      }
    }

    let row = tr('prefecture', cells)
    tableBody.appendChild(row)
  }
}

const process = (summary, patients) => {
  _state.patients = patients
  _state.prefectureSummary = summary.prefectures
  _state.dailySummary = summary.daily

  console.log(patients.length)
}

const initActions = () => {
  document.querySelectorAll('.action').forEach(element => {
    element.addEventListener('click', e => {
      e.preventDefault()
      _state.selectedField = e.target.dataset.field
      render()
      e.target.classList.add('active')
    })
  })
}

const main = () => {
  initActions()

  const requests = [
    fetch('/patient_data/latest.json').then(response => response.json()),
    fetch('/summary/latest.json').then(response => response.json()),
  ]

  Promise.all(requests)
    .then(responses => {
      const patients = responses[0]
      const summary = responses[1]
      process(summary, patients)
      render()
    })
}

window.addEventListener('DOMContentLoaded', e => {
  main()
})
