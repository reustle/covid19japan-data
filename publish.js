const moment = require('moment')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')


// Creates a symlink to the latest version of the data (which can be served)
const publish = () => {
  // Add 540 = UTC+9 for JST.
  const dateString = moment().utcOffset(540).format('YYYY-MM-DD')
  
  for (let dir of ['patient_data', 'summary']) {
    let files = fs.readdirSync(path.join('.', 'docs', dir))
    let sorted = _.reverse(_.sortBy(_.filter(files, v => { return v.startsWith('2020')})))
    if (sorted.length > 0) {
      let latest = sorted[0]
      let latestDestPath = path.join('.', 'docs', dir, latest)
      let latestPath = path.join('.', 'docs', dir, 'latest.json')

      fs.unlink(latestPath, err => {
        // deliberately ignore err.
        console.log(`Symlink to ${latest} from ${latestPath}`)
        fs.symlinkSync(latest, latestPath)
      })
    }
  }
}

publish()