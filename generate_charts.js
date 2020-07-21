// Generates static SVG charts for covid19japan.com

const fs = require('fs')
const _ = require('lodash')
const moment = require('moment')
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

const drawLineChartsForPlace = (place, period, avgPeriod, outputName) => {
  let startDate = moment(place.dailyConfirmedStartDate, 'YYYY-MM-DD')
  let values = _.map(place.dailyConfirmedCount, (o, i) => { 
    return {value: o, i: i, date: startDate.add(1, 'days').format('YYYY-MM-DD')}
  })

  // Calculate avg values.
  let avgValues = _.slice(charts.rollingAverage(values, avgPeriod, 'value'), values.length - period)
  // Strip values to only the desired duration.
  avgValues = _.slice(avgValues, avgValues.length - period)
  values = _.slice(values, values.length - period)
  // Remove the last value if it is 0 (indicating we don't have any new data for that day.)
  if (values[values.length - 1].value == 0) {
    values = _.slice(values, 0, values.length - 1)
  }
  if (avgValues[avgValues.length - 1].value == 0) {
    avgValues = _.slice(avgValues, 0, avgValues.length - 1)
  }

  drawLineChart(values, outputName)
  drawLineChart(avgValues, `${outputName}_avg`)
}

const drawPrefectureLineCharts = (prefectureSummaries, duration) => {
  for (let place of prefectureSummaries) {
    let name = place.name.toLowerCase().replace(/[\s]+/g, '_')
    drawLineChartsForPlace(place, duration, 7, `${name}_confirmed_daily`)
  }
}

const drawRegionalLineCharts = (regionalSummaries, duration) => {
  for (let place of regionalSummaries) {
    let name = place.name.toLowerCase().replace(/[\s]+/g, '_')
    drawLineChartsForPlace(place, duration, 7, `region_${name}_confirmed_daily`)
  } 
}

const drawDailyLineCharts = (dailySummaries, duration) => {
  const avgPeriod = 7

  let dailyCharts = ['deceased', 'recovered', 'critical', 'tested', 'confirmed', 'active']
  for (let chartValue of dailyCharts) {
    let values = _.map(dailySummaries, o => { return { date: o.date, value:o[chartValue] } })
    let avgValues = _.slice(charts.rollingAverage(values, avgPeriod, 'value'), values.length - duration)
    values = _.slice(values, values.length - duration)
    // Remove the last value if it is 0 (indicating we don't have any new data for that day.)
    if (values[values.length - 1].value == 0) {
      values = _.slice(values, 0, values.length - 1)
    }
    if (avgValues[avgValues.length - 1].value == 0) {
      avgValues = _.slice(avgValues, 0, avgValues.length - 1)
    }
  

    drawLineChart(values, `${chartValue}_daily`)
    drawLineChart(avgValues, `${chartValue}_daily_avg`)
  }

  for (let chartValue of dailyCharts) {
    let values = _.map(dailySummaries, o => { return { date: o.date, value:o[`${chartValue}Cumulative`] } })
    let avgValues = _.slice(charts.rollingAverage(values, avgPeriod, 'value'), values.length - duration)
    values = _.slice(values, values.length - duration)
    // Remove the last value if it is 0 (indicating we don't have any new data for that day.)
    if (values[values.length - 1].value == 0) {
      values = _.slice(values, 0, values.length - 1)
    }
    if (avgValues[avgValues.length - 1].value == 0) {
      avgValues = _.slice(avgValues, 0, avgValues.length - 1)
    }
  

    drawLineChart(values, `${chartValue}_cumulative`)
    drawLineChart(avgValues, `${chartValue}_cumulative_avg`)
  }
}

const main = () => {
  const summaryFile = fs.readFileSync(`./docs/summary/latest.json`)
  const summary = JSON.parse(summaryFile)
  drawPrefectureBarCharts(summary.prefectures, 30)
  drawPrefectureLineCharts(summary.prefectures, 60)
  drawRegionalLineCharts(summary.regions, 60)
  drawDailyLineCharts(summary.daily, 60)
}

main()
