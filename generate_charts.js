const fs = require('fs')
const _ = require('lodash')
const charts = require('./src/charts.js')

const summaryFile = fs.readFileSync(`./docs/summary/latest.json`)
const summary = JSON.parse(summaryFile)
const dailySummaries = summary.daily

// generate summary for confirmed 
const historyLength = 60
const confirmedValues = _.slice(_.map(summary.daily, o => { return { date: o.date, value:o.confirmedAvg7d } }), summary.daily.length - historyLength)
const deceasedValues = charts.rollingAverage(
  _.slice(_.map(summary.daily, o => { return { date: o.date, value:o.deceased } }), summary.daily.length - historyLength),
  7, 
  'value')
const svg = charts.svgSparklineWithData(deceasedValues, 400, 80)
console.log(svg)