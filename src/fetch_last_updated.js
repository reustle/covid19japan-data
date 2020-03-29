const drive = require('drive-db')
const fs = require('fs')
const _ = require('lodash')

const SHEET = '1jfB4muWkzKTR0daklmf8D5F0Uf_IYAgcx_-Ij9McClQ'
const SHEET_LAST_UPDATED_TAB = 4


async function fetchLastUpdated() {
  return drive({sheet: SHEET, tab: SHEET_LAST_UPDATED_TAB})
    .then(db => {
      if (db && db.length > 0) {
        return db[0].lastupdated
      }
      return ''
    })
}

exports.fetchLastUpdated = fetchLastUpdated;
