const moment = require('moment')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')


// Creates a symlink to the latest version of the data (which can be served)
const publish = () => {
  const dateString = moment().format('YYYY_MM_DD')
  
  for (let dir of ['patient_data', 'summary']) {
    let files = fs.readdirSync(path.join('.', 'docs', dir))
    let sorted = _.reverse(_.sortBy(_.filter(files, v => { return v.startsWith('2020')})))
    if (sorted.length > 0) {
      let latest = sorted[0]
      let latestDestPath = path.join('.', 'docs', dir, latest)
      let latestPath = path.join('.', 'docs', dir, 'latest.json')

      fs.unlink(latestPath, err => {
        // ignore err deliberately.
        console.log(`Symlink to ${latestDestPath} from ${latestPath}`)
        fs.symlinkSync(latestDestPath, latestPath)
      })
    }
  }
}

publish()