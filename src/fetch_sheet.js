// 
// Simple Google Sheets API v4 client that fetches row data and creates a drive-db
// like object for consumption.
//

const fetch = require('node-fetch')
const _ = require('lodash')

const SHEET_API_KEY = 'AIzaSyADbri4duIMaXSaqtFMyAJW0qCDCgFdlF0'
const SHEET_ID = '1jfB4muWkzKTR0daklmf8D5F0Uf_IYAgcx_-Ij9McClQ'

const sheetURL = (sheetId) => {
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${SHEET_API_KEY}`
}

const sheetRowsURL = (sheetId, sheetName) => {
  let encodedSheetName = encodeURIComponent(sheetName)
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodedSheetName}?key=${SHEET_API_KEY}`
}

const fetchTabs = () => {
  return fetch(sheetURL(SHEET_ID))
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

const headerFields = (json, normalizeHeaderName) => {
  if (!json || !json.values || json.values.length < 1) {
    return null
  }
  if (!normalizeHeaderName) {
    normalizeHeaderName = defaultNormalizeName
  }
  return _.filter(_.map(json.values[0], normalizeHeaderName), _.isString)
}

const rowsToObjects = (json, normalizeHeaderName) => {
  // First row is the key.
  let fields = headerFields(json, normalizeHeaderName)
  if (fields) {
    return _.map(_.slice(json.values, 1), (v) => { 
      return _.omitBy(_.zipObject(fields, v), _.isUndefined)
    })
  }
  return []
}

/// @param sheetName String, name of the tab to fetch.
/// @param headerNormalizer Function, takes a header name and normalize it into a key. Default _.camelCase.
const fetchRows = (sheetName, headerNormalizer) => {
  return fetch(sheetRowsURL(SHEET_ID, sheetName))
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
