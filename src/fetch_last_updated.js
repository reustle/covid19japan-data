const fetch = require('node-fetch')
const moment = require('moment')

const SHEET = '1jfB4muWkzKTR0daklmf8D5F0Uf_IYAgcx_-Ij9McClQ'
const SHEET_JSON_URL_BASE = 'https://spreadsheets.google.com/feeds/list/'

const fetchLastUpdated = () => {
  return fetch(`${SHEET_JSON_URL_BASE}${SHEET}/1/public/values?alt=json`)
    .then(response => {
      return response.json()
    })
    .then(json => {
      console.log(json.feed.updated)
      if (json && json.feed && json.feed.updated && json.feed.updated['$t']) {
        let timestamp = moment(json.feed.updated['$t']).utc(540).format('YYYY-MM-DD, H:mm')
        return `${timestamp} JST`
      }
      return ''
    })
}

exports.fetchLastUpdated = fetchLastUpdated