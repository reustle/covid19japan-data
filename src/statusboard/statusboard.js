const prefectures = require('./prefectures.csv')
const { sources } = require('./sources.js')

const { fetchCsv, fetchPatients } = require('./csv.js')
const { fetchCovidJson, fetchCovidJsonPatients } = require('./covidjson.js')
const { fetchFukushimaPatients } = require('./fukushima.js')
const { extractDailySummary, prefectureCountsInEnglish } = require('./nhk.js')

import * as d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';

const rowByPrefecture = {}
const responses = {}

const fetchPrefectureData = (prefectureSource, prefectureName) => {
  let prefectureInfo = prefectureSource
  if (prefectureInfo && prefectureInfo.patients) {
    if (prefectureInfo.patients.format == 'csv') {
      return fetchPatients(prefectureInfo.patients.url, prefectureInfo.patients.encoding, fetch)
    }  else if (prefectureInfo.patients.format == 'json') {
      return fetchCovidJsonPatients(prefectureInfo.patients.url, prefectureInfo.patients.key)
    } else if (prefectureName == 'fukushima') {
      return fetchFukushimaPatients(prefectureInfo.patients.url, prefectureInfo.patients.encoding, fetch)
    }
  }
}

const fetchAllPrefectureData = (prefectureSources) => {
  _.forEach(prefectureSources, (prefectureSource, prefectureId) => {
    let fetcher = fetchPrefectureData(prefectureSource, prefectureId)
    if (fetcher) {
      fetcher.then(patients => {
        responses[prefectureId] = patients
        createPrefecturePatientCountCell(prefectureId, patients)
        createPrefecturePatientTodayCell(prefectureId, patients)
      })
    }
  })
}

const showPatients = (prefectureId) => {
  let patients = responses[prefectureId]
  if (!patients) {
    console.error(`No response cached for ${prefectureId}`)
  }

  document.querySelector('#console').value = JSON.stringify(patients)
  let patientList = d3.select('#patients')
  d3.selectAll('.patient-item').remove()

  let row = 2
  for (let patient of patients) {
    createPatientItemCells(prefectureId, patientList, patient, row)
    row++
  }
}

const createPatientItemCells = (prefectureId, patientList, patient, row) => {
  const fields = ['patientId', 'dateAnnounced', 'age', 'gender', 'residence']
  const dataPairs = _.map(fields, k => { 
    let v = patient[k]
    if (!v) return null
    return [k, v]
  })
  const data = _.filter(dataPairs, _.negate(_.isNull))
  console.log(data)

  for (let d of data) {
    let value = d[1]
    if (d[0] == 'patientId') {
      value = _.capitalize(prefectureId) + '#' + prefectureId
    }
    patientList.append('div')
        .attr('class', 'patient-item')
        .attr('grid-column', d[0])
        .attr('grid-row', row)
        .style('grid-column', d[0])
        .style('grid-row', row)
        .text(value)
  }
}

const createPrefecturePatientTodayCell = (prefectureId, patients) => {
  let patientsToday = 0
  let patientsYesterday = 0
  let latestPatientDate = ''

  let today = moment().format('YYYY-MM-DD')
  let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
  console.log(today, yesterday)
  if (patients) {
    for (let patient of patients) {
      if (patient.dateAnnounced == today) {
        patientsToday++;
      }
      if (patient.dateAnnounced == yesterday) {
        patientsYesterday++;
      }
    }
  }

  if (patients.length) {
    latestPatientDate = _.last(patients).dateAnnounced
  }

  d3.select('#statusboard') 
    .append('div')
    .attr('class', 'item')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'latest')
    .text(latestPatientDate)  

  d3.select('#statusboard') 
    .append('div')
    .attr('class', 'item')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'today')
    .text(patientsToday)  

  d3.select('#statusboard') 
    .append('div')
    .attr('class', 'item')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'yesterday')
    .text(patientsYesterday)  
}

const createPrefecturePatientCountCell = (prefectureId, patients) => {
  let patientCount = 0
  if (patients) {
    patientCount = patients.length
  }
  d3.select('#statusboard') 
    .append('div')
    .attr('class', 'dataCount item')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .append('a')
    .attr('href', '#')
    .text(patientCount)
    .on('click', e => {
      showPatients(prefectureId)
    })
}

const createPrefectureSiteCountCell = (prefectureId, summary) => {
  d3.select('#statusboard') 
    .append('div')
    .attr('class', 'item')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'site')
    .text(summary.confirmed)
}

const createPrefectureNHKCountCell = (prefectureId, count) => {
  d3.select('#statusboard') 
    .append('div')
    .attr('class', 'item nhk-value')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'nhk')
    .text(count)
}


const createPrefectureRow = (prefecture, prefectureSources, rowNumber) => {
  let dashURL = null
  let govURL = null
  if (prefectureSources) {
    dashURL = prefectureSources.dashboard
    if (prefectureSources.gov && prefectureSources.gov.patients) {
      govURL = prefectureSources.gov.patients
    }
  }

  d3.select('#statusboard')
    .append('div')
    .attr('class', 'prefecture item')
    .style('grid-row', rowNumber)
    .text(prefecture.prefecture_en)

  if (dashURL) {
    d3.select('#statusboard')
      .append('div')
      .attr('class', 'dash item')
      .style('grid-row', rowNumber)
      .append('a')
      .attr('href', dashURL)
      .text('dash')
  }

  if (govURL) {
    d3.select('#statusboard')
      .append('div')
      .attr('class', 'gov item')
      .style('grid-row', rowNumber)
      .append('a')
      .attr('href', govURL)
      .text('gov')    
  }
}

const fetchNHKReport = (url) => {
  extractDailySummary(url).then(values => {
    let results = prefectureCountsInEnglish(values)
    responses.nhk = results
    console.log(results)
    _.forEach(results, (v, k) => {
      createPrefectureNHKCountCell(k.toLowerCase(), v)
    })
  })
}

const fetchSiteData = () => {
  fetch('https://data.covid19japan.com/summary/latest.json')
    .then(response => response.json())
    .then(json => {
      responses.site = json
      for (let prefecture of json.prefectures) {
        console.log(prefecture)
        let prefectureId = prefecture.name.toLowerCase()
        createPrefectureSiteCountCell(prefectureId, prefecture)
      }
    })
}

const initStatusBoard = () => {
  let row = 2
  for (let prefecture of prefectures) {
    let prefectureId = prefecture.prefecture_en.toLowerCase()
    let prefectureSources = sources[prefectureId]
    rowByPrefecture[prefectureId] = row
    createPrefectureRow(prefecture, prefectureSources, row++)
  }
}

const initConsole = () => {
  document.querySelector('#toggle-console').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector('#console-panel').classList.toggle('collapsed');
  })
}

const initPopulateButton = () => {
  document.querySelector('#populate-action').addEventListener('click', e => {
    e.preventDefault()
    fetchAllPrefectureData(sources)
    e.target.classList.add('active')
  })
}

const initNHKButton = () => {
  let nhkUrl = window.localStorage.getItem('nhk-url')
  if (nhkUrl) {
    document.querySelector('#nhk-url').value = nhkUrl
  }

  document.querySelector('#nhk-action').addEventListener('click', e => {
    e.preventDefault()
    let url = document.querySelector('#nhk-url').value
    if (url) {
      window.localStorage.setItem('nhk-url', url)
      fetchNHKReport(url)
    } else {
      alert('url missing')
    }
    e.target.classList.add('active')
  })

  document.querySelector('#nhk-copy-action').addEventListener('click', e => {
    let nhkItems = document.querySelectorAll('.item.nhk-value')
    let clipboardContents = ''
    console.log(nhkItems)
    let valuesByPrefecture = {}

    for (let item of nhkItems) {
      let value = item.innerText
      let prefectureId = item.dataset.prefectureId
      valuesByPrefecture[prefectureId] = value
    }

    for (let prefecture of prefectures) {
      let prefectureId = prefecture.prefecture_en.toLowerCase()
      let value = valuesByPrefecture[prefectureId]
      if (!value) {
        value = 0
      }
      clipboardContents += `${value}\n`
      console.log(prefectureId, value)
    }

    navigator.clipboard.writeText(clipboardContents)
    document.querySelector('#console').value = clipboardContents
  })
}

const initSiteDataButton = () => {
  document.querySelector('#site-data-action').addEventListener('click', e => {
    e.preventDefault()
    fetchSiteData()
    e.target.classList.add('active')
  })
}

const main = () => {
  initConsole()
  initStatusBoard()
  initPopulateButton()
  initNHKButton()
  initSiteDataButton()
}

window.addEventListener('DOMContentLoaded', e => {
  main()
})
