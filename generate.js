const fs = require("fs");
const moment = require("moment");
const _ = require("lodash");
const process = require("process");
const { program } = require("commander");

const FetchPatientData = require("./src/fetch_patient_data");
const Summarize = require("./src/summarize");
const FetchSheet = require("./src/fetch_sheet");
const MergePatients = require("./src/merge_patients");
const Prefectures = require("./src/prefectures");
const { writeSpreadsheets } = require("./src/test_data");

const areSummariesDifferent = (summary, existingSummary) => {
  if (existingSummary.daily) {
    if (existingSummary.daily.length < summary.daily.length) {
      return true;
    }

    const latestDaily = summary.daily[summary.daily.length - 1];
    const latestDailyFromExisting = existingSummary.daily[existingSummary.daily.length - 1];

    if (latestDaily.confirmedCumulative !== latestDailyFromExisting.confirmedCumulative) {
      return true;
    }
  }
  return false;
};

const calculateLastUpdated = async (summary) => {
  let lastUpdated = null;
  const existingSummaryData = fs.readFileSync("./docs/summary/latest.json");
  if (existingSummaryData) {
    const existingSummary = JSON.parse(existingSummaryData);
    // Check if summary is different.
    if (existingSummary) {
      if (areSummariesDifferent(summary, existingSummary)) {
        if (existingSummary.updated && typeof existingSummary.updated === "string") {
          lastUpdated = existingSummary.updated;
          // console.log(`Pulling lastUpdated from summary/latest.json: ${lastUpdated}`)
        }
      } else {
        lastUpdated = existingSummary.lastUpdated;
      }
    }
  }

  // If the summary is different, then use the current time as the timestamp.
  if (lastUpdated == null) {
    lastUpdated = moment().utcOffset(540).format();
  }
  return lastUpdated;
};

const filterPatientForOutput = (patient) => {
  const filtered = { ...patient };
  if (patient.ageBracket === -1) {
    delete filtered.ageBracket;
  }
  delete filtered.patientCount;
  return filtered;
};

const mergeAndOutput = (allPatients, daily, prefectures, cruiseCounts, recoveries) => {
  const patients = MergePatients.mergePatients(allPatients);
  console.log(`Total patients fetched: ${patients.length}`);

  // Write patient data
  const patientOutputFilename = "./docs/patient_data/latest.json";
  const patientOutput = patients.map(filterPatientForOutput);
  fs.writeFileSync(patientOutputFilename, JSON.stringify(patientOutput));
  console.log(`Patients written to: ${patientOutputFilename}`);

  // Write daily and prefectural summary.
  const prefectureNames = Prefectures.prefectureNamesEn();
  const regions = Prefectures.regionPrefectures();
  console.log("Generating summary ...");
  const summary = Summarize.summarize(
    patients, daily, prefectures, cruiseCounts, recoveries, prefectureNames, regions,
  );
  return calculateLastUpdated(summary).then((lastUpdated) => {
    console.log("Using lastUpdate timestamp", lastUpdated);
    summary.lastUpdated = lastUpdated;

    const summaryOutputFilename = "./docs/summary/latest.json";
    fs.writeFileSync(summaryOutputFilename, JSON.stringify(summary, null, "  "));
    console.log(`Summary written to: ${summaryOutputFilename}`);

    // Write minified version of daily/prefectural summary
    const summaryMinifiedOutputFilename = "./docs/summary_min/latest.json";
    fs.writeFileSync(summaryMinifiedOutputFilename, JSON.stringify(summary));
    console.log(`Summary (minimized) written to: ${summaryMinifiedOutputFilename}`);
    console.log("Success.");
  });
};

const fetchPatients = async (sheetId) => {
  const tabsBatchSize = 6;
  let tabs = [
    "Patient Data",
    "Aichi",
    "Chiba",
    "Fukuoka",
    "Hokkaido",
    "Kanagawa",
    "Osaka",
    "Saitama",
    "Tokyo",
  ];

  // Split tabs into requests with maximum tabBatchSize
  // to prevent response from being too long.
  const requests = [];
  while (tabs.length > 0) {
    const thisRequestTabs = tabs.slice(0, tabsBatchSize);
    tabs = tabs.slice(tabsBatchSize);
    requests.push(FetchPatientData.fetchPatientDataFromSheets([{
      sheetId,
      tabs: thisRequestTabs,
    }]));
  }
  // Execute the requests.
  return Promise.all(requests)
    .then((patientLists) => _.flatten(patientLists));
};

const fetchAndSummarize = async (testDataDir, outputTestDataDir) => {
  const latestSheetId = "1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY";

  let daily = [];
  let prefectures = [];
  let cruiseCounts = [];
  let recoveries = [];

  if (testDataDir) {
    daily = JSON.parse(fs.readFileSync(`${testDataDir}/daily.json`));
    prefectures = JSON.parse(fs.readFileSync(`${testDataDir}/prefectures.json`));
    cruiseCounts = JSON.parse(fs.readFileSync(`${testDataDir}/cruiseCounts.json`));
    recoveries = JSON.parse(fs.readFileSync(`${testDataDir}/recoveries.json`));
    console.log(`Read daily,prefectures,cruiseCounts,recoveries from ${testDataDir}`);
  } else {
    daily = await FetchSheet.fetchRows(latestSheetId, "Sum By Day");
    prefectures = await FetchSheet.fetchRows(latestSheetId, "Prefecture Data");
    cruiseCounts = await FetchSheet.fetchRows(latestSheetId, "Cruise Sum By Day");
    recoveries = await FetchSheet.fetchRows(latestSheetId, "Recoveries");
    console.log(`Fetched daily,prefectures,cruiseCounts,recoveries from ${latestSheetId}`);
    if (outputTestDataDir) {
      writeSpreadsheets({
        daily,
        prefectures,
        cruiseCounts,
        recoveries,
      }, outputTestDataDir);
    }
  }

  let allPatients = [];
  if (testDataDir) {
    allPatients = JSON.parse(fs.readFileSync(`${testDataDir}/allPatients.json`));
    console.log(`Read allPatients from ${testDataDir}`);
  } else {
    allPatients = await fetchPatients(latestSheetId);
    console.log(`Fetched allPatients from ${latestSheetId}`);
    if (outputTestDataDir) {
      writeSpreadsheets({ allPatients }, outputTestDataDir);
    }
  }

  return mergeAndOutput(allPatients, daily, prefectures, cruiseCounts, recoveries);
};

// Not yet completed.
//
// const writePerPrefecturePatients = (prefectureName, allPatients, dateString) => {
//   const lowercasePrefecture = _.camelCase(prefectureName);
//   const prefecturePatientsFilename = `./docs/patients/${lowercasePrefecture}_${dateString}.json`;
//   const prefecturePatients = _.filter(allPatients, (v) => v.detectedPrefecture === prefectureName);
//   fs.writeFileSync(prefecturePatientsFilename, JSON.stringify(prefecturePatients, null, "  "));
// };

try {
  program.version("0.0.1");
  program
    .option("-t, --test-data-dir <testDataDir>", "Use test data")
    .option("-o, --output-test-data-dir <outputTestDataDir>", "Output test data");
  program.parse(process.argv);

  fetchAndSummarize(program.testDataDir, program.outputTestDataDir).then(() => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Memory used ${Math.round(used * 100) / 100} MB`);
  });
} catch (e) {
  console.error(e);
}
