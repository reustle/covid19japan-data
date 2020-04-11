const fs = require('fs')
const _ = require('lodash')

const FetchTokyoCases = require('./src/fetch_tokyo_counts.js')

const generateTokyoCounts = () => {
  FetchTokyoCases.fetchTokyoCounts()
    .then(tokyoCases => {
      const filename = `./docs/tokyo/counts.json`
      fs.writeFileSync(filename, JSON.stringify(tokyoCases, null, '  '))
    })
}

try {
  generateTokyoCounts()
} catch (e) {
  console.error(e)
}
