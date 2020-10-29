import _ from 'lodash'
import moment from 'moment'
import { div, span, tr, td, el } from 'quickelement'
import Summary from '../summarize.js'

// Helper method to do parseInt safely (reverts to 0 if unparse)
const safeParseInt = v => {
  let result = parseInt(v)
  if (isNaN(result)) {
    return 0
  }
  return result
}

const th = (klass, attributes, contents) => { return el('th', klass, attributes, contents ) } 

const _state = {
  maxDaysBefore: 120,
  countMethod: 'cumulative',
  selectedField: 'confirmed',
  orderBy: 'name',  
  ignoredPrefectures: ['Diamond Princess Cruise Ship'],
  patients: []
}

const orderByDirection = {
  name: 'asc',
  confirmed: 'desc',
}

const cellWithValue = (klass, value) => {
  if (value != undefined && !isNaN(value) && value != 0) { 
    return td(klass, `${value}`)
  } 
  return td(klass, '')
}

const render = () => {
  const table = document.querySelector('table#prefectures')
  const tableHead = table.querySelector('thead')
  const tableBody = table.querySelector('tbody')

  tableHead.innerHTML = ''
  const prefectureHeaderCell = th('', {id: 'prefectureHeader'}, 'Prefecture')
  prefectureHeaderCell.addEventListener('click', e => { 
    _state.orderBy = 'name'
    render()
  })
  const totalHeaderCell = th('', {id: 'totalHeader'}, 'Total')
  totalHeaderCell.addEventListener('click', e => {
    _state.orderBy = 'confirmed'
    render()
  })

  let columnHeaders = [
    prefectureHeaderCell,
    totalHeaderCell
  ]

  const fieldProperties = {
    confirmed: { count: 'daily', name: 'dailyConfirmedCount' },
    deceased: { count: 'daily', name: 'dailyDeceasedCount' },
    recovered: { count: 'cumulative', name: 'dailyRecoveredCumulative'},
    active: { count: 'cumulative', name: 'dailyActive' }
  }

  let totalsByDay = {}
  let dates = []

  const dateFormat = 'YYYY-MM-DD'
  const samplePrefecture = _state.prefectureSummary[0]
  const latestDataDay = moment(samplePrefecture.dailyConfirmedStartDate).add(samplePrefecture.dailyConfirmedCount.length - 1, 'days')

  if (fieldProperties[_state.selectedField]) {
    dates = _.map(_.range(0, _state.maxDaysBefore), i => moment(latestDataDay).subtract(i, 'days'))
    columnHeaders = _.concat(columnHeaders, _.map(dates, date => th('', date.format('M/DD'))))
    _.forEach(dates, o => { totalsByDay[o.format(dateFormat)] = 0 })
  }
  tableHead.appendChild(tr('', columnHeaders))

  tableBody.innerHTML = ''

  const orderedPrefectures = _.orderBy(_state.prefectureSummary, [_state.orderBy], [orderByDirection[_state.orderBy]])
  for (let prefecture of orderedPrefectures) {
    if (_state.ignoredPrefectures.indexOf(prefecture.name) != -1) {
      console.log('ignoring', prefecture.name)
      continue
    }
    let cells = [td('prefectureName', prefecture.name)]

    // Total
    cells.push(cellWithValue(_state.selectedField, prefecture[_state.selectedField]))

    // Historical
    if (fieldProperties[_state.selectedField].count == 'daily') {
      const dailyValues = prefecture[fieldProperties[_state.selectedField].name]
      if (dailyValues) {
        for (const daysAgo of _.range(0, _state.maxDaysBefore)) {
          const val = safeParseInt(dailyValues[dailyValues.length - 1 - daysAgo])
          if (_state.countMethod == 'cumulative') {
            val = _.sum(_.slice(dailyValues, 0, dailyValues.length - daysAgo))
          }

          cells.push(cellWithValue('val', val))
          totalsByDay[dates[daysAgo].format(dateFormat)] += val
        }
      }
    } else if (fieldProperties[_state.selectedField].count == 'cumulative') {
      const totalValues = prefecture[fieldProperties[_state.selectedField].name]
      if (totalValues) {
        for (const daysAgo of _.range(0, _state.maxDaysBefore)) {
          const totalValue = safeParseInt(totalValues[totalValues.length - 1 - daysAgo])
          const yesterdayTotalValue = safeParseInt(totalValues[totalValues.length - 1 - daysAgo - 1])
          const dailyValue = totalValue - yesterdayTotalValue
          let val = dailyValue
          if (_state.countMethod == 'cumulative') {
            val = totalValue
          }
          let classes = ['val']
          if (val < 0) {
            classes.push('neg')
          }
          cells.push(cellWithValue(classes, val))
          totalsByDay[dates[daysAgo].format(dateFormat)] += val
        }
      }
    }

    let row = tr('prefecture', cells)
    tableBody.appendChild(row)
  }

  // Fill out total row in the header.
  let totalsByDayElements = [
    td('', ''),
    td('', ''),
  ]
  for (const date of dates) {
    totalsByDayElements.push(td('', totalsByDay[date.format(dateFormat)].toString()))
  }
  tableHead.appendChild(tr('', totalsByDayElements))
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
