const prefectures = require('./prefectures.csv')
const { sources } = require('./sources.js')

const { fetchCsv, fetchPatients } = require('./csv.js')
const { fetchCovidJson, fetchCovidJsonPatients } = require('./covidjson.js')
const { fetchFukushimaPatients } = require('./fukushima.js')
const { extractDailySummary, prefectureCountsInEnglish } = require('./nhk.js')
const { fetchOpenDataPatients } = require('./opendata.js')
const { fetchSummaryFromHtml } = require('./html.js')

import { select, selectAll, event } from 'd3-selection'
import _ from 'lodash';
import moment from 'moment';

const DATA_START_ROW = 3
const rowByPrefecture = {}
const responses = {}

const fetchPrefectureLatest = (prefectureSource, rowId, city) => {
  if (prefectureSource.latest) {
    fetchSummaryFromHtml(prefectureSource.latest.url, prefectureSource.latest.extract, prefectureSource.latest.encoding)
      .then(result => {
        if (result) {
          console.log('latest:', rowId, result.latest)
          if (result.latest) {
            createCell(rowId, 'gov-latest', result.latest, result.latest, city)
          }
        }
      })
  }
}

const fetchPrefectureSummary = (prefectureSource, prefectureId, city) => {
  if (!prefectureSource.summary) {
    return;
  }

  if (prefectureSource.summary.format == 'json') {
    fetchCovidJson(prefectureSource.summary.url)
      .then(response => {
        let mainSummary = response
        if (prefectureSource.summary.mainSummaryKey) {
          let summaries = _.at(response, [prefectureSource.summary.mainSummaryKey])[0]
          mainSummary = _.last(summaries)
        }
        if (prefectureSource.summary.confirmed) {
          let number = _.at(mainSummary, [prefectureSource.summary.confirmed])[0]
          createCell(prefectureId, 'gov-confirmed', number, city)
        }
        if (prefectureSource.summary.deceased) {
          let number = _.at(mainSummary, [prefectureSource.summary.deceased])[0]
          createCell(prefectureId, 'gov-deceased', number, city)
        }
        if (prefectureSource.summary.recovered) {
          let number = _.at(mainSummary, [prefectureSource.summary.recovered])[0]
          createCell(prefectureId, 'gov-recovered', number, city)
        }
      })
  } else if (prefectureSource.summary.format == 'html') {
    fetchSummaryFromHtml(prefectureSource.summary.url, prefectureSource.summary.extract, prefectureSource.summary.encoding)
      .then(result => {
        if (result) {
          if (result.image) {
            createLinkCell(prefectureId, 'gov-confirmed', 'image', 'image', result.image, city)
          }
          if (result.deceased) {
            createCell(prefectureId, 'gov-deceased', result.deceased, city)
          }
          if (result.recovered) { 
            createCell(prefectureId, 'gov-recovered', result.recovered, city)
          }
          if (result.confirmed) { 
            createCell(prefectureId, 'gov-confirmed', result.confirmed, city)
          }
        }
      })
  }
}

const fetchPrefectureData = (prefectureSource, prefectureId) => {
  let prefectureInfo = prefectureSource
  let fetcher = null
  if (prefectureInfo && prefectureInfo.patients) {
    if (prefectureInfo.patients.format == 'csv') {
      fetcher = fetchPatients(prefectureInfo.patients.url, prefectureInfo.patients.encoding, fetch)
    }  else if (prefectureInfo.patients.format == 'json') {
      fetcher = fetchCovidJsonPatients(prefectureInfo.patients.url, prefectureInfo.patients.key)
    } else if (prefectureInfo.patients.format == 'opendata_csv') {
      fetcher = fetchOpenDataPatients(
        prefectureInfo.patients.url, 
        prefectureInfo.patients.resourceName, 
        prefectureInfo.patients.encoding,
        fetch)
    } else if (prefectureId == 'fukushima') {
      fetcher = fetchFukushimaPatients(prefectureInfo.patients.url, prefectureInfo.patients.encoding, fetch)
    }
  }

  if (fetcher) {
    fetcher.then(patients => {
      responses[prefectureId] = patients
      createPrefecturePatientCountCell(prefectureId, patients)
      createPrefecturePatientTodayCell(prefectureId, patients)
    })
  }
}

const fetchAllPrefectureData = (prefectureSources) => {
  _.forEach(prefectureSources, (prefectureSource, prefectureId) => {
    fetchPrefectureData(prefectureSource, prefectureId)
    fetchPrefectureSummary(prefectureSource, prefectureId)
    fetchPrefectureLatest(prefectureSource, prefectureId)
    if (prefectureSource.cities) {
      for (let cityId of _.keys(prefectureSource.cities)) {
        let prefectureCitySource = prefectureSource.cities[cityId]
        fetchPrefectureData(prefectureCitySource, cityId)
        fetchPrefectureSummary(prefectureCitySource, cityId, cityId)
        fetchPrefectureLatest(prefectureCitySource, cityId, cityId)
    
      }
    }
  })
}

const showPatients = (prefectureId) => {
  let patients = responses[prefectureId]
  if (!patients) {
    console.error(`No response cached for ${prefectureId}`)
  }

  document.querySelector('#console').value = JSON.stringify(patients)
  let patientList = select('#patients')
  selectAll('.patient-item').remove()

  let row = DATA_START_ROW
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
  for (let d of data) {
    let value = d[1]
    if (d[0] == 'patientId') {
      value = _.capitalize(prefectureId) + '#' + value
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

  select('#statusboard') 
    .append('div')
    .attr('class', 'item')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'dash-latest')
    .text(latestPatientDate)  

  select('#statusboard') 
    .append('div')
    .attr('class', 'item')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'dash-today')
    .text(patientsToday)  

  select('#statusboard') 
    .append('div')
    .attr('class', 'item')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'dash-yesterday')
    .text(patientsYesterday)  
}

const createPrefecturePatientCountCell = (placeId, patients) => {
  let patientCount = 0
  if (patients) {
    patientCount = patients.length
  }
  select(`#statusboard`) 
    .append('div')
    .attr('class', _.join(['item', 'dash-confirmed', placeId], ' '))
    .attr('data-prefecture-id', placeId)
    .style('grid-row', rowByPrefecture[placeId])
    .style('grid-column', 'dash-confirmed')
    .append('a')
    .attr('href', `/statusboard/patients.html#${placeId}`)
    .attr('target', '_blank')
    .text(patientCount)
    .on('click', e => {
      event(this).preventDefault()
      showPatients(placeId)
    })
}

const createPrefectureSiteCountCell = (prefectureId, summary) => {
  select('#statusboard') 
    .append('div')
    .attr('class', 'item')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'site-confirmed')
    .text(summary.confirmed)
  select('#statusboard') 
    .append('div')
    .attr('class', 'item')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'site-recovered')
    .text(summary.recovered)    
}

const createPrefectureNHKCountCell = (prefectureId, count) => {
  select('#statusboard') 
    .append('div')
    .attr('class', 'item nhk-value')
    .attr('data-prefecture-id', prefectureId)
    .style('grid-row', rowByPrefecture[prefectureId])
    .style('grid-column', 'nhk-confirmed')
    .text(count)
}

const createCell = (rowId, column, text, title, city) => {
  let cityClass = city ? 'city' : ''
  select('#statusboard') 
    .append('div')
    .attr('class', _.join(['item', column, rowId, cityClass], ' '))
    .attr('data-prefecture-id', rowId)
    .attr('title', title)
    .style('grid-row', rowByPrefecture[rowId])
    .style('grid-column', column)
    .text(text)
}

const createLinkCell = (rowId, column, text, title, url, city) => {
  let cityClass = city ? 'city' : ''
  select('#statusboard') 
    .append('div')
    .attr('class', _.join(['item', column, rowId, cityClass], ' '))
    .attr('data-prefecture-id', rowId)
    .attr('title', title)
    .style('grid-row', rowByPrefecture[rowId])
    .style('grid-column', column)
    .append('a')
      .attr('href', url)
      .attr('target', '_blank')
      .text(text)
}

const createPrefectureRow = (placeName, prefectureSource, rowNumber, prefectureCity) => {

  let name = placeName
  if (prefectureCity) {
    name = `&nbsp;↳&nbsp;${placeName}`
  }
  let placeId = placeName.toLowerCase()
  let htmlClass = 'item'
  if (prefectureCity) {
    htmlClass = 'item city'
  }

  select('#statusboard')
    .append('div')
    .attr('class', htmlClass + ' place')
    .style('grid-row', rowNumber)
    .style('grid-column', 'place')
    .append('a')
      .attr('href', '#')
      .html(name)
      .on('click', () => { 
        event.preventDefault()
        fetchPrefectureData(prefectureSource, placeId)
        fetchPrefectureSummary(prefectureSource, placeId)
        fetchPrefectureLatest(prefectureSource, placeId)
      })


  if (prefectureSource) {
    if (prefectureSource.dashboard) {
      select('#statusboard')
        .append('div')
        .attr('class', 'item')
        .style('grid-row', rowNumber)
        .style('grid-column', 'dash-link')
        .append('a')
        .attr('href', prefectureSource.dashboard)
        .attr('target', '_blank')
        .text('dash')
    }
    if (prefectureSource.gov) {
      if (prefectureSource.gov.patients) {
        select('#statusboard')
          .append('div')
          .attr('class', htmlClass)
          .style('grid-row', rowNumber)
          .style('grid-column', 'gov-link-patients')
          .append('a')
          .attr('href', prefectureSource.gov.patients)
          .attr('target', '_blank')
          .text('reports')    
      }
      if (prefectureSource.gov.summary) {
        select('#statusboard')
          .append('div')
          .attr('class', htmlClass)
          .style('grid-row', rowNumber)
          .style('grid-column', 'gov-link-summary')
          .append('a')
          .attr('href', prefectureSource.gov.summary)
          .attr('target', '_blank')
          .text('sum')    
      }
      if (prefectureSource.gov.deaths) {
        select('#statusboard')
          .append('div')
          .attr('class', htmlClass)
          .style('grid-row', rowNumber)
          .style('grid-column', 'gov-link-deaths')
          .append('a')
          .attr('href', prefectureSource.gov.deaths)
          .attr('target', '_blank')
          .text('deaths')    
      }    
      if (prefectureSource.gov.patientList) {
        select('#statusboard')
          .append('div')
          .attr('class', htmlClass)
          .style('grid-row', rowNumber)
          .style('grid-column', 'gov-link-list')
          .append('a')
          .attr('href', prefectureSource.gov.patientList)
          .attr('target', '_blank')
          .text('list')    
      }    
    }
  }      
}


const fetchNHKReport = (url) => {
  extractDailySummary(url, window.fetch, true).then(values => {
    let results = prefectureCountsInEnglish(values)
    responses.nhk = results
    let prefectureCounts = results.prefectureCounts
    _.forEach(prefectureCounts, (v, k) => {
      let prefectureId = k.toLowerCase()
      if (typeof rowByPrefecture[prefectureId] === 'undefined') {
        return
      }
      createPrefectureNHKCountCell(prefectureId, v)
    })
  })
}

const fetchSiteData = () => {
  fetch('https://data.covid19japan.com/summary/latest.json')
    .then(response => response.json())
    .then(json => {
      responses.site = json
      for (let prefecture of json.prefectures) {
        let prefectureId = prefecture.name.toLowerCase()
        if (typeof rowByPrefecture[prefectureId] === 'undefined') {
          continue
        }
        createPrefectureSiteCountCell(prefectureId, prefecture)
      }
    })
}

const initStatusBoard = () => {
  let row = DATA_START_ROW
  for (let prefecture of prefectures) {
    let prefectureId = prefecture.prefecture_en.toLowerCase()
    let prefectureSources = sources[prefectureId]
    rowByPrefecture[prefectureId] = row
    createPrefectureRow(prefecture.prefecture_en, prefectureSources, row++)
    if (prefectureSources && prefectureSources.cities) {
      // Add cities
      _.forEach(prefectureSources.cities, (citySource, cityName) => {
        rowByPrefecture[cityName.toLowerCase()] = row
        createPrefectureRow(cityName, citySource, row++, cityName)
      })
    }
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

const initCitiesToggle = () => {
  document.querySelector('#toggle-cities').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector('#statusboard').classList.toggle('hide-cities')
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

    // Add other aux data at the end.
    console.log(responses.nhk)
    if (responses.nhk) {
      if (!responses.nhk.portQuarantineCount) { responses.nhk.portQuarantineCount = 0 }
      clipboardContents += `${responses.nhk.portQuarantineCount}\n`
      if (!responses.nhk.critical) { responses.nhk.critical = 0 }
      clipboardContents += `${responses.nhk.critical}\n`
      if (!responses.nhk.deceased) { responses.nhk.deceased = 0 }
      clipboardContents += `${responses.nhk.deceased}\n`
      if (!responses.nhk.recoveredJapan) { responses.nhk.recoveredJapan = 0 }
      clipboardContents += `${responses.nhk.recoveredJapan}\n`
      if (!responses.nhk.recoveredTotal) { responses.nhk.recoveredTotal = 0 }
      clipboardContents += `${responses.nhk.recoveredTotal}\n`
    }

    navigator.clipboard.writeText(clipboardContents)
    document.querySelector('#console').value = clipboardContents
  })
}


const main = () => {
  initConsole()
  initStatusBoard()
  fetchSiteData()
  initPopulateButton()
  initCitiesToggle()
  initNHKButton()
}

window.addEventListener('DOMContentLoaded', e => {
  main()
})
