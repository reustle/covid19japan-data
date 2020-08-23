const fs = require('fs')
const _ = require('lodash')
const moment = require('moment')
const Papa = require('papaparse')

const Prefectures = require('./src/prefectures.js')

const main = () => {
  const today = moment()
  const startDate = moment('2020-03-26')
  const prefectureNames = Prefectures.prefectureNamesEn()

  const prefectureRecoveries = {
    'Port Quarantine': {},
    'Unspecified': {}
  }

  for (const prefectureName of prefectureNames) { 
    prefectureRecoveries[prefectureName] = {}
  }



  let date = startDate
  let dates = []
  while (date < today) {
    const dateString = date.format('YYYY-MM-DD')
    const filename = `docs/summary/${dateString}.json`
    if (fs.statSync(filename).isFile()) {
      console.log(filename)
      dates.push(dateString)
      const summary = JSON.parse(fs.readFileSync(filename))
      for (const prefectureDay of summary.prefectures) {
        const recovered = prefectureDay.recovered
        if (prefectureRecoveries[prefectureDay.name]) {
          prefectureRecoveries[prefectureDay.name][dateString] = recovered
        }
      }
    }

    date = date.add(1, 'days')
  }

  const csvData = _.map(_.keys(prefectureRecoveries), k => { 
    let v = prefectureRecoveries[k]
    let o = Object.assign({name: k}, v)
    return o
  })

  let csvString = Papa.unparse(csvData, {
    header: true,
    columns: _.concat(['name'], _.reverse(dates))
  })

  console.log(csvData)

  fs.writeFileSync('./docs/prefecture_recoveries.csv', csvString)
  fs.writeFileSync('./docs/prefecture_recoveries.json', JSON.stringify(prefectureRecoveries))
  //console.log(prefectureRecoveries)
}

main()

