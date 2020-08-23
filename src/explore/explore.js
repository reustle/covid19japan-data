import _ from 'lodash'
import moment from 'moment'
import { div, span, tr, td, el } from 'quickelement'
import Summary from '../summarize.js'



const th = (klass, attributes, contents) => { return el('th', klass, attributes, contents ) } 

const _state = {
  maxDaysBefore: 60,
  countMethod: 'cumulative',
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

  tableHead.innerHTML = ''
  let columnHeaders = [
    th('', 'Prefecture'),
    th('', 'Total'),
  ]

  const fieldWithHistory = ['confirmed', 'deceased', 'recovered']

  if (fieldWithHistory.indexOf(_state.selectedField) != -1) {
    let dates = _.map(_.range(0, _state.maxDaysBefore), i => { return moment().subtract(i, 'days').format('M/DD') })
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
        let totalValue = _.sum(_.slice(dailyValues, 0, dailyValues.length - 1 - daysAgo))
        let dailyValue = parseInt(dailyValues[dailyValues.length - 1 - daysAgo])
        let val = dailyValue
        if (_state.countMethod == 'cumulative') {
          val = totalValue
        }
      cells.push(cellWithValue('val', val))
      }
    } else if (_state.selectedField == 'recovered') {
      let recoveries = _state.prefectureRecoveries[prefecture.name]
      if (recoveries) {
        for (let daysAgo of _.range(0, _state.maxDaysBefore)) {
          const dateString = moment().subtract(daysAgo, 'days').format('YYYY-MM-DD')
          const prevDateString = moment().subtract(daysAgo + 1, 'days').format('YYYY-MM-DD')
          const totalValue = parseInt(recoveries[dateString])
          const prevTotalValue = parseInt(recoveries[prevDateString])
          if (isNaN(prevTotalValue)) {
            prevTotalValue = 0
          }
          let dailyValue = totalValue - prevTotalValue
          if (prefecture.name == 'Tokyo') {
            console.log(prevDateString, prevTotalValue)
          }

          let val = dailyValue
          if (_state.countMethod == 'cumulative') {
            val = totalValue
          }
          cells.push(cellWithValue('val', val))
        }
      }
    }

    let row = tr('prefecture', cells)
    tableBody.appendChild(row)
  }
}

const process = (summary, patients, prefectureRecoveries) => {
  _state.patients = patients
  _state.prefectureSummary = summary.prefectures
  _state.dailySummary = summary.daily
  _state.prefectureRecoveries = prefectureRecoveries
}

const initActions = () => {
  document.querySelectorAll('.action.field').forEach(element => {
    element.addEventListener('click', e => {
      e.preventDefault()
      let target = e.target
      _state.selectedField = target.dataset.field
      render()
      document.querySelectorAll('.action.field.selected').forEach(element => { element.classList.remove('selected') })
      target.classList.add('selected')
    })
  })

  document.querySelectorAll('.action.countMethod').forEach(element => {
    element.addEventListener('click', e => {
      e.preventDefault()
      let target = e.target
      _state.countMethod = target.dataset.countMethod
      render()
      document.querySelectorAll('.action.countMethod.selected').forEach(element => { element.classList.remove('selected') })
      target.classList.add('selected')
    })
  })
}

const main = () => {
  initActions()

  const requests = [
    fetch('/patient_data/latest.json').then(response => response.json()),
    fetch('/summary/latest.json').then(response => response.json()),
    fetch('/prefecture_recoveries.json').then(response => response.json()),
  ]

  Promise.all(requests)
    .then(responses => {
      const patients = responses[0]
      const summary = responses[1]
      const prefectureRecoveries = responses[2]
      process(summary, patients, prefectureRecoveries)
      render()
    })
}

window.addEventListener('DOMContentLoaded', e => {
  main()
})
