const _ = require('lodash')
const Papa = require('papaparse')
const fs = require('fs')

const prefectureNamesEn = () => {
  let prefecturesCsv = fs.readFileSync('./src/statusboard/prefectures.csv', 'utf8')
  let prefecturesList = Papa.parse(prefecturesCsv, {header: true})
  return _.map(prefecturesList.data, o => o.prefecture_en)
}

const regionPrefectures = () => {
  let prefecturesCsv = fs.readFileSync('./src/statusboard/prefectures.csv', 'utf8')
  let prefecturesList = Papa.parse(prefecturesCsv, {header: true})
  let regions = {}
  for (let prefecture of prefecturesList.data) {
    if (prefecture.region) {
      if (regions[prefecture.region]) {
        regions[prefecture.region].push(prefecture.prefecture_en)
      } else {
        regions[prefecture.region] = [prefecture.prefecture_en]
      }
    }
  }
  return regions
}

exports.prefectureNamesEn = prefectureNamesEn;
exports.regionPrefectures = regionPrefectures;
