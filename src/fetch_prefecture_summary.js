const drive = require('drive-db')
const fs = require('fs')
const _ = require('lodash')

const SHEET = '1jfB4muWkzKTR0daklmf8D5F0Uf_IYAgcx_-Ij9McClQ'
const SHEET_PREFECTURE_TAB = 2


async function fetchPrefectureSummary() {
  return drive({sheet: SHEET, tab: SHEET_PREFECTURE_TAB})
    .then(db => {
      return db
    })
}

exports.fetchPrefectureSummary = fetchPrefectureSummary;
