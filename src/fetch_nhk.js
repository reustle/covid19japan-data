// Get data from NHK
//
// Sources:
// https://www3.nhk.or.jp/news/special/coronavirus/data-widget/
// https://www3.nhk.or.jp/news/special/coronavirus/data/
//
// https://www3.nhk.or.jp/news/special/coronavirus/data/widget-info.xml
// Japan-wide: https://www3.nhk.or.jp/n-data/opendata/coronavirus/nhk_news_covid19_domestic_daily_data.csv
// Prefecture: https://www3.nhk.or.jp/n-data/opendata/coronavirus/nhk_news_covid19_prefectures_daily_data.csv

const fetch = require('node-fetch')
const Papa = require('papaparse')
const { prefectureJaToEn } = require('./prefectures.js')

const fetchPrefectureCases = async () => {
  const url = 'https://www3.nhk.or.jp/n-data/opendata/coronavirus/nhk_news_covid19_prefectures_daily_data.csv'
  const response = await fetch(url)
  const text = await response.text()
  const parseConfig = {
    header: true,
    transformHeader: (header) => {
      switch (header.trim()) {
        case '日付':
          return 'date'
        case '都道府県名':
          return 'prefecture'
        case '各地の感染者数_1日ごとの発表数':
          return 'dailyCases'
        case '各地の感染者数_累計':
          return 'totalCases'
        case '各地の死者数_1日ごとの発表数':
          return 'dailyDeaths'
        case '各地の死者数_累計':
          return 'totalDeaths'
        default:
          return header
      }
    }
  }
  const data = Papa.parse(text, parseConfig)
  const prefectureCases = []
  const prefectureMap = await prefectureJaToEn()
  for (let row of data.data) {
    if (!row.prefecture || !row.date) {
      continue;
    }
    let prefecture = prefectureMap[row.prefecture]
    if (!prefecture) {
      continue;
    }

    let dateComponents = row.date.split(/\//)

    let transformed = {
      dateAnnounced: `${dateComponents[0]}-${dateComponents[1].padStart(2, 0)}-${dateComponents[2].padStart(2, 0)}`,
      prefecture: prefecture,
      dailyCases: parseInt(row.dailyCases),
      totalCases: parseInt(row.totalCases),
      dailyDeaths: parseInt(row.dailyDeaths),
      totalDeaths: parseInt(row.totalDeaths)
    }
    prefectureCases.push(transformed)
  }
  return prefectureCases
}

exports.fetchPrefectureCases = fetchPrefectureCases
