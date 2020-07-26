// 
// Simple Google Sheets API v4 client that fetches row data and creates a drive-db
// like object for consumption.
//

const process = require('process')
const fetch = require('node-fetch')
const _ = require('lodash')
const dotenv = require('dotenv')
const {google} = require('googleapis')

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

const fetchSheets = (sheetsAndTabs, fields) => {
  const sheets = google.sheets({version: 'v4', auth: getSheetApiKey()});
  const requests = []
  for (let sheetInfo of sheetsAndTabs) {
    let tabs = sheetInfo.tabs
    let sheetId = sheetInfo.sheetId

    let request = new Promise((resolve, reject) => {
      sheets.spreadsheets.get({
        spreadsheetId: sheetId,
        ranges: tabs,
        fields: fields
      }, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        console.log(res.data)
        //const rows = res.sheets[0];
        resolve(res.data)
      });
    })
    requests.push(request)
  }

  return Promise.all(requests)
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