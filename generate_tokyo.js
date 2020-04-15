const fs = require('fs')
const _ = require('lodash')

const FetchTokyoCases = require('./src/fetch_tokyo_counts.js')

const generateTokyoCounts = () => {
  FetchTokyoCases.fetchTokyoCounts()
    .then(tokyoCases => {
      console.log(`Read ${tokyoCases.length} Tokyo wards/cities.`)
      if (tokyoCases.length > 0) {
        const filename = `./docs/tokyo/counts.json`
        fs.writeFileSync(filename, JSON.stringify(tokyoCases, null, '  '))
      }
    })
}

try {
  generateTokyoCounts()
} catch (e) {
  console.error(e)
}
