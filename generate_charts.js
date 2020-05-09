// Generates static SVG charts for covid19japan.com

const fs = require('fs')
const _ = require('lodash')
const charts = require('./src/charts.js')


const drawLineChart = (values, name, absValues) => {
  const options = {
    padding: {top: 20, bottom: 0, left: 0, right: 0},
    showCeilingValue: true,
    showLastValue: false,
    absValues: absValues ? absValues : values
  }

  const svg = charts.svgSparklineWithData(values, 180, 60, options)
  fs.writeFileSync(`./docs/charts/${name}.svg`, svg)
}

const drawBarChart = (values, name, maxY, fillColor) => {
  const svg = charts.svgBarChartWithData(values, 480, 160, maxY, fillColor)
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
    drawBarChart(_.slice(values, values.length - duration), name, prefectureMax, 'rgb(164,173,192)')
  }
}

const drawDailyLineCharts = (dailySummaries, duration) => {
  const avgPeriod = 7

  let dailyCharts = ['deceased', 'recovered', 'critical', 'tested', 'confirmed', 'active']
  for (let chartValue of dailyCharts) {
    let values = _.map(dailySummaries, o => { return { date: o.date, value:o[chartValue] } })
    const avgValues = _.slice(charts.rollingAverage(values, avgPeriod, 'value'), values.length - duration)
    values = _.slice(values, values.length - duration)
    let lastValue = _.last(values)
    drawLineChart(values, `${chartValue}_daily`)
    drawLineChart(avgValues, `${chartValue}_daily_avg`, values)
  }

  for (let chartValue of dailyCharts) {
    let values = _.map(dailySummaries, o => { return { date: o.date, value:o[`${chartValue}Cumulative`] } })
    const avgValues = _.slice(charts.rollingAverage(values, avgPeriod, 'value'), values.length - duration)
    values = _.slice(values, values.length - duration)
    let lastValue = _.last(values)
    drawLineChart(values, `${chartValue}_cumulative`)
    drawLineChart(avgValues, `${chartValue}_cumulative_avg`, values)
  }
}

const main = () => {
  const summaryFile = fs.readFileSync(`./docs/summary/latest.json`)
  const summary = JSON.parse(summaryFile)
  drawPrefectureBarCharts(summary.prefectures, 30)
  drawDailyLineCharts(summary.daily, 60)
}

main()
