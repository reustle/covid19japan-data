const fs = require('fs')
const _ = require('lodash')
const charts = require('./src/charts.js')

const summaryFile = fs.readFileSync(`./docs/summary/latest.json`)
const summary = JSON.parse(summaryFile)
const dailySummaries = summary.daily

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

const drawDailyLineCharts = (dailySummaries, duration) => {
  const avgDuration = 7

  let dailyCharts = ['deceased', 'recovered', 'critical', 'tested', 'confirmed']
  for (let chartValue of dailyCharts) {
    const values = _.map(dailySummaries, o => { return { date: o.date, value:o[chartValue] } })
    const avgValues = _.slice(charts.rollingAverage(values, avgDuration, 'value'), values.length - duration)
    drawLineChart(values, `${chartValue}Daily`)
    drawLineChart(avgValues, `${chartValue}DailyAvg`)
    if (chartValue == 'confirmed') {
      console.log(avgValues)
    }
  }

  for (let chartValue of dailyCharts) {
    const values = _.map(dailySummaries, o => { return { date: o.date, value:o[`${chartValue}Cumulative`] } })
    const avgValues = _.slice(charts.rollingAverage(values, avgDuration, 'value'), values.length - duration)
    drawLineChart(values, `${chartValue}Cumulative`)
    drawLineChart(avgValues, `${chartValue}CumulativeAvg`)
  }
}

drawPrefectureBarCharts(summary.prefectures, 30)
drawDailyLineCharts(summary.daily, 60)