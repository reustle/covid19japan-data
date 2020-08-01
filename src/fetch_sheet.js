// 
// Simple Google Sheets API v4 client that fetches row data and creates a drive-db
// like object for consumption.
//

const process = require('process')
const fetch = require('node-fetch')
const _ = require('lodash')
const dotenv = require('dotenv')
const {google} = require('googleapis')

const DEFAULT_FIELD_MASK = 'spreadsheetId,properties,sheets.properties,sheets.data.rowData.values(effectiveValue,formattedValue,effectiveFormat.hyperlinkDisplayType,hyperlink)'

// Read GOOGLE_API_KEY from .env if it exists.
dotenv.config()

const getSheetApiKey = () => {
  return process.env.GOOGLE_API_KEY
}

const sheetURL = (sheetId) => {
  const sheetApiKey = getSheetApiKey()
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${sheetApiKey}`
}

const sheetRowsURL = (sheetId, sheetName) => {
  const sheetApiKey = getSheetApiKey()
  const encodedSheetName = encodeURIComponent(sheetName)
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodedSheetName}?key=${sheetApiKey}`
}

// Use the v4 JS API to fetch sheet data.
const fetchSheets = (sheetsAndTabs, fieldMask) => {
  const sheets = google.sheets({version: 'v4', auth: getSheetApiKey()});
  const requests = []
  if (!fieldMask) {
    fieldMask = DEFAULT_FIELD_MASK
  }
  for (let sheetInfo of sheetsAndTabs) {
    let tabs = sheetInfo.tabs
    let sheetId = sheetInfo.sheetId

    let request = new Promise((resolve, reject) => {
      sheets.spreadsheets.get({
        spreadsheetId: sheetId,
        ranges: tabs,
        fields: fieldMask
      }, (err, res) => {
        if (err) {
          reject(err)
          return
        }

        let parsedSheets = []
        for (let sheet of res.data.sheets) {
          let rows = _.map(sheet.data[0].rowData, _.property('values'))
          parsedSheets.push(sheetRowsToObject(rows))
        }
        resolve(parsedSheets)
      });
    })
    requests.push(request)
  }

  return Promise.all(requests)
}


const sheetRowsToObject = (rows, normalizeHeaderName) => {
  if (!rows || !rows.length || rows.length < 1) {
    return []
  }

  const headerValues = _.map(rows[0], _.property('formattedValue'))
  const fields = headerFields(_.map(headerValues, normalizeHeaderName))
  if (fields) {
    return _.map(_.slice(rows, 1), (v) => { 
      return _.omitBy(_.zipObject(fields, v), _.isUndefined)
    })
  }
  return []
}


const fetchTabs = (sheetId) => {
  return fetch(sheetURL(sheetId))
    .then(response => response.json())
    .then(json => {
      let tabs = {}
      for (let sheet of json.sheets) {
        if (sheet.properties) {
          let name = sheet.properties.title
          tabs[name] = sheet.properties
        }
      }
      return tabs
    })
}


const defaultNormalizeName = (headerName) => {
  return _.camelCase(headerName)
}

const headerFields = (headerRowValues, normalizeHeaderName) => {
  if (!headerRowValues || headerRowValues.length < 1) {
    return null
  }
  if (!normalizeHeaderName) {
    normalizeHeaderName = defaultNormalizeName
  }
  return _.filter(_.map(headerRowValues, normalizeHeaderName), _.isString)
}


const rowsToObjects = (json, normalizeHeaderName) => {
  // First row is the key.
  if (!json.values || !json.values.length || json.values.length < 1) {
    return []
  }

  let fields = headerFields(json.values[0], normalizeHeaderName)
  if (!fields) {
    return []
  }

  return _.map(_.slice(json.values, 1), (v) => { 
    return _.omitBy(_.zipObject(fields, v), _.isUndefined)
  })
}

/// @param sheetName String, name of the tab to fetch.
/// @param headerNormalizer Function, takes a header name and normalize it into a key. Default _.camelCase.
const fetchRows = (sheetId, sheetName, headerNormalizer) => {
  return fetch(sheetRowsURL(sheetId, sheetName))
    .then(response => response.json())
    .then(json => {
       return rowsToObjects(json, headerNormalizer)
    })
    .catch(err => {
      console.error(err)
      return []
    })
}

exports.fetchTabs = fetchTabs;
exports.fetchRows = fetchRows;
exports.fetchSheets = fetchSheets;