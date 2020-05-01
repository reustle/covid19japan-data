const fs = require('fs')
const _ = require('lodash')
const charts = require('./src/charts.js')

const summaryFile = fs.readFileSync(`./docs/summary/latest.json`)
const summary = JSON.parse(summaryFile)
const dailySummaries = summary.daily

// generate summary for confirmed 
const historyLength = 60
const deceasedValues = charts.rollingAverage(
  _.slice(_.map(summary.daily, o => { return { date: o.date, value:o.deceased } }), summary.daily.length - historyLength),
  7, 
  'value')
//const svg = charts.svgSparklineWithData(deceasedValues, 400, 80)

const drawLineChart = (values, name) => {
  const svg = charts.svgSparklineWithData(values, 400, 80)
  fs.writeFileSync(`./docs/charts/${name}.svg`, svg)
}

const drawBarChart = (values, name, maxY) => {
  const svg = charts.svgBarChartWithData(values, 400, 80, maxY)
  fs.writeFileSync(`./docs/charts/${name}.svg`, svg)
}

const drawPrefectureBarCharts = (prefectureSummaries, duration) => {
  let maxY = 0
  for (let prefecture of prefectureSummaries) {
    let prefectureMax = _.max(prefecture.dailyConfirmedCount)
    if (prefectureMax > maxY) {
      maxY = prefectureMax
    }
  }

  for (let prefecture of prefectureSummaries) {
    let name = _.camelCase(prefecture.name)
    let values = _.slice(prefecture.dailyConfirmedCount, prefecture.dailyConfirmedCount.length - duration)
    let avgValues = charts.rollingAverage(_.map(values, o => { return {value: o}}), 7, 'value')
    drawBarChart(avgValues, name, maxY)
  }
}

const drawCumulativeLineCharts = (dailySummaries, duration) => {
  let confirmedValues = _.slice(_.map(dailySummaries, o => { return { date: o.date, value:o.confirmedAvg7d } }), dailySummaries.length - duration)
  console.log(confirmedValues)
  drawLineChart(confirmedValues, 'confirmedDailyAvg')

  let dailyCharts = ['deceased', 'recovered', 'critical']
  for (let chartValue of dailyCharts) {
    let values = _.map(dailySummaries, o => { return { date: o.date, value:o[chartValue] } })
    values = _.slice(charts.rollingAverage(values, 7), values.length - duration)
    drawLineChart(values, `${chartValue}DailyAvg`)
  }
}

drawPrefectureBarCharts(summary.prefectures, 30)
drawCumulativeLineCharts(summary.daily, 60)