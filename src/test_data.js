/** For generating test data. */

const fs = require("fs");

// Unuused
// const moment = require('moment');
// const currentDateString = () => {
//   // Add 540 = UTC+9 for JST.
//   return moment().utcOffset(540).format('YYYY-MM-DD')
// }

const writeSpreadsheetData = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data));
  console.log("Wrote file: ", filename);
};

const writeSpreadsheets = (datasets, outputDir) => {
  for (const datasetName of Object.keys(datasets)) {
    const filename = `${outputDir}/${datasetName}.json`;
    writeSpreadsheetData(filename, datasets[datasetName]);
  }
};

module.exports = {
  writeSpreadsheets,
  writeSpreadsheetData,
};
