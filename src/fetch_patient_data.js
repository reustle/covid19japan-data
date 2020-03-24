const drive = require("drive-db")
const fs = require('fs')
const path = require('path')

const SHEET = "1jfB4muWkzKTR0daklmf8D5F0Uf_IYAgcx_-Ij9McClQ"
const SHEET_PATIENT_DATA_TAB = 1

async function run(destination_file) {
  console.log("Fetching data...");
  drive({sheet: SHEET, tab: SHEET_PATIENT_DATA_TAB})
    .then(db => {
      fs.writeFileSync(destination_file, JSON.stringify(db))
    })
}

exports.run = run;
