const fs = require('fs')
const _ = require('lodash')
const charts = require('./src/charts.js')


const drawLineChart = (values, name) => {
  const svg = charts.svgSparklineWithData(values, 400, 80)
  fs.writeFileSync(`./docs/charts/${name}.svg`, svg)
}

const drawBarChart = (values, name, maxY, fillColor) => {
  const svg = charts.svgBarChartWithData(values, 400, 80, maxY, fillColor)
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
    let name = prefecture.name.toLowerCase().replace(/[\s]+/g, '_')
    const values = _.map(prefecture.dailyConfirmedCount, o => { return {value: o}})
    let prefectureMax = _.max(prefecture.dailyConfirmedCount)
    if (prefectureMax < maxY / 4 )  {
      prefectureMax *= 2  // scale up lower numbers
    } else if (prefectureMax < maxY / 2 )  {
        prefectureMax *= 1.33  // scale up lower numbers
    } else {
      prefectureMax = maxY
    }
    const avgValues = charts.rollingAverage(values, 7, 'value')
    drawBarChart(_.slice(values, values.length - duration), name, prefectureMax, 'rgba(128, 128, 128, 1)')
  }
}

const drawDailyLineCharts = (dailySummaries, duration) => {
  const avgDuration = 7

  let dailyCharts = ['deceased', 'recovered', 'critical', 'tested', 'confirmed']
  for (let chartValue of dailyCharts) {
    const values = _.map(dailySummaries, o => { return { date: o.date, value:o[chartValue] } })
    const avgValues = _.slice(charts.rollingAverage(values, avgDuration, 'value'), values.length - duration)
    drawLineChart(values, `${chartValue}_daily`)
    drawLineChart(avgValues, `${chartValue}_daily_avg`)
  }

  for (let chartValue of dailyCharts) {
    const values = _.map(dailySummaries, o => { return { date: o.date, value:o[`${chartValue}Cumulative`] } })
    const avgValues = _.slice(charts.rollingAverage(values, avgDuration, 'value'), values.length - duration)
    drawLineChart(values, `${chartValue}_cumulative`)
    drawLineChart(avgValues, `${chartValue}_cumulative_avg`)
  }
}

const summaryFile = fs.readFileSync(`./docs/summary/latest.json`)
const summary = JSON.parse(summaryFile)
drawPrefectureBarCharts(summary.prefectures, 30)
drawDailyLineCharts(summary.daily, 60)