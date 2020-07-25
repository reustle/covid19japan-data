const fs = require('fs')
const _ = require('lodash')
const Papa = require('papaparse')
const verify = require('./src/verify.js')

let summary = JSON.parse(fs.readFileSync('docs/summary/latest.json'))
verify.verifyDailySummary(summary.daily)
console.log(summary.daily[summary.daily.length - 1])