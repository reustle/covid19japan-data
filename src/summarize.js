// Summarizes data for site.
const _ = require("lodash");
const moment = require("moment");
const verify = require("./verify.js");
const { PATIENTS_FORMAT_COVID19JAPAN, PATIENTS_FORMAT_NHK } = require("./patient_format");

const CRUISE_PASSENGER_DISEMBARKED = /^Cruise Disembarked Passenger/;
const TIMELINE_FIRST_DAY = moment("2020-01-08");

/**
 * Merge all the data from the spreadsheet with auto-calculation
 * @param {Array} patientData Array of patients data (either from NHK or our COVID19Japan spreadsheet)
 * @param {*} manualDailyData  List of rows from the Sum By Day spreadsheet.
 * @param {*} manualPrefectureData   List of rows from the Prefecture Data spreadsheet
 * @param {*} cruiseCounts Data from cruise ship cases
 * @param {*} recoveries Data of recoveries, one prefecture per row.
 * @param {*} prefectureNames List of all prefectures
 * @param {*} regions List of all regions
 * @returns A dictionary with the prefecture and daily summaries.
 */
const summarize = (patients, manualDailyData, manualPrefectureData, cruiseCounts, recoveries, prefectureNames, regions) => {
  patients.patients = _.orderBy(patients.patients, ["dateAnnounced"], ["asc"]);
  console.log("Patients ordered.");

  // Convert recoveries into an Object with prefecture names as keys.
  const recoveryByPrefecture = _.fromPairs(_.map(recoveries, (row) => [row.name, _.omit(row, ["name", "p"])]));

  const prefectureSummary = generatePrefectureSummary(patients, manualPrefectureData, cruiseCounts, recoveryByPrefecture, prefectureNames);
  console.log("Generated prefectureSummary");
  const dailySummary = generateDailySummary(patients, manualDailyData, prefectureSummary, cruiseCounts);
  console.log("Generated dailySummary");
  const regionSummary = generateRegionSummary(prefectureSummary, regions);
  console.log("Generated regionSummary");

  return {
    prefectures: prefectureSummary,
    regions: regionSummary,
    daily: dailySummary,
  };
};

// Helper method to do parseInt safely (reverts to 0 if unparse)
const safeParseInt = (v) => {
  const result = parseInt(v);
  if (isNaN(result)) {
    return 0;
  }
  return result;
};

const DAILY_SUMMARY_TEMPLATE = {
  confirmed: 0,
  confirmedCumulative: 0,
  deceased: 0,
  deceasedCumulative: 0,
  reportedDeceased: 0,
  reportedDeceasedCumulative: 0,
  recovered: 0,
  recoveredCumulative: 0,
  critical: 0,
  criticalCumulative: 0,
  tested: 0,
  testedCumulative: 0,
  active: 0,
  activeCumulative: 0,
  cruiseConfirmedCumulative: 0,
  cruiseDeceasedCumulative: 0,
  cruiseRecoveredCumulative: 0,
  cruiseTestedCumulative: 0,
  cruiseCriticalCumulative: 0,
};

// Generates the daily summary
const generateDailySummary = (patients, manualDailyData, prefectureSummary, cruiseCounts) => {
  const dailySummary = {};
  for (const patient of patients.patients) {
    const { dateAnnounced } = patient;
    if (!patient.dateAnnounced) {
      continue;
    }

    if (!dailySummary[dateAnnounced]) {
      dailySummary[dateAnnounced] = _.assign({}, DAILY_SUMMARY_TEMPLATE);
    }

    if (patients.format == PATIENTS_FORMAT_COVID19JAPAN) { // Old patients data type (from spreadsheet)
      if (patient.confirmedPatient) {
        if (!dailySummary[dateAnnounced]) {
          dailySummary[dateAnnounced] = _.assign({}, DAILY_SUMMARY_TEMPLATE);
        }
        dailySummary[dateAnnounced].confirmed += patient.patientCount || 1;
      }

      if (patient.patientStatus == "Deceased") {
        let dateDeceased = dateAnnounced;
        let dateReported = dateAnnounced;

        // Use deceasedDate if that exists.
        if (patient.deceasedDate) {
          dateDeceased = patient.deceasedDate;
        }

        // Use reported date if that exists when it comes to death reports.
        if (patient.deceasedReportedDate) {
          dateReported = patient.deceasedReportedDate;
        }

        if (dateDeceased) {
          if (!dailySummary[dateDeceased]) {
            dailySummary[dateDeceased] = _.assign({}, DAILY_SUMMARY_TEMPLATE);
          }
          dailySummary[dateDeceased].deceased += patient.patientCount || 1;
        }

        if (dateReported) {
          if (!dailySummary[dateReported]) {
            dailySummary[dateReported] = _.assign({}, DAILY_SUMMARY_TEMPLATE);
          }
          dailySummary[dateReported].reportedDeceased += patient.patientCount || 1;
        }
      }
    } else if (patients.format == PATIENTS_FORMAT_NHK) {  // Using NHK based data
      dailySummary[dateAnnounced].confirmed += patient.dailyCases || 0;
      dailySummary[dateAnnounced].deceased += patient.dailyDeaths || 0;
      dailySummary[dateAnnounced].reportedDeceased += patient.dailyDeaths || 0;
    }
  }

  // merge manually sourced data
  // TODO: critical should be pulled out of our patient
  //       data. But those numbers are incomplete.
  for (const row of manualDailyData) {
    if (dailySummary[row.date]) {
      dailySummary[row.date].recoveredCumulative = safeParseInt(row.recovered);
      dailySummary[row.date].criticalCumulative = safeParseInt(row.critical);
      dailySummary[row.date].testedCumulative = safeParseInt(row.tested);
    }
  }

  // merge cruise ship data
  for (const row of cruiseCounts) {
    if (dailySummary[row.date]) {
      dailySummary[row.date].cruiseConfirmedCumulative = safeParseInt(row.dpConfirmed) + safeParseInt(row.nagasakiConfirmed);
      dailySummary[row.date].cruiseCriticalCumulative = safeParseInt(row.dpCritical) + safeParseInt(row.nagasakiCritical);
      dailySummary[row.date].cruiseTestedCumulative = safeParseInt(row.dpTested) + safeParseInt(row.nagasakiTested);
      dailySummary[row.date].cruiseDeceasedCumulative = safeParseInt(row.dpDeceased) + safeParseInt(row.nagasakiDeceased);
      dailySummary[row.date].cruiseRecoveredCumulative = safeParseInt(row.dpRecovered) + safeParseInt(row.nagasakiRecovered);
    }
  }

  let orderedDailySummary = _.map(_.sortBy(_.toPairs(dailySummary), (a) => a[0]), (v) => { const o = v[1]; o.date = v[0]; return o; });

  // Aggregate the cumulative adjustments (NHK/MHLW discrepency data) from the prefecture data.
  let recoveredAdjustment = 0;
  let confirmedAdjustment = 0;
  for (const prefecture of prefectureSummary) {
    console.log(prefecture.name, prefecture.recoveredAdjustment, prefecture.confirmedAdjustment);
    recoveredAdjustment += safeParseInt(prefecture.recoveredAdjustment);
    confirmedAdjustment += safeParseInt(prefecture.confirmedAdjustment);
  }

  // Calculate the cumulative and incremental numbers by iterating through all the days in order
  let confirmedCumulative = 0;
  let deceasedCumulative = 0;
  let reportedDeceasedCumulative = 0;

  for (const dailySum of orderedDailySummary) {
    // confirmed.
    confirmedCumulative += dailySum.confirmed;
    dailySum.confirmedCumulative = confirmedCumulative;
    // deceased
    deceasedCumulative += dailySum.deceased;
    dailySum.deceasedCumulative = deceasedCumulative;
    // reportedDeceased
    reportedDeceasedCumulative += dailySum.reportedDeceased;
    dailySum.reportedDeceasedCumulative = reportedDeceasedCumulative;
  }

  const cumulativeKeys = [
    "recoveredCumulative",
    "deceasedCumulative",
    "reportedDeceasedCumulative",
    "criticalCumulative",
    "testedCumulative",
    "cruiseConfirmedCumulative",
    "cruiseDeceasedCumulative",
    "cruiseCriticalCumulative",
    "cruiseTestedCumulative",
    "cruiseRecoveredCumulative",
  ];
  // For dates we don't have any manually entered data, pass those forward.
  for (let i = 1; i < orderedDailySummary.length; i++) {
    const thisDay = orderedDailySummary[i];
    const previousDay = orderedDailySummary[i - 1];
    for (const key of cumulativeKeys) {
      if (thisDay[key] == 0) {
        thisDay[key] = previousDay[key];
      }
    }
  }

  // (Workaround) Calculate the smeared daily adjustment to be applied. This ensures the
  // adjustments we apply don't appear as spikes in our data.
  const days = orderedDailySummary.length;
  const dailyRecoveredAdjustment = recoveredAdjustment / days;
  const dailyConfirmedAdjustment = confirmedAdjustment / days;
  let adjustedDay = 0;
  console.log("recoveredAdjustment:", recoveredAdjustment, dailyRecoveredAdjustment);
  console.log("confirmedAdjustment:", confirmedAdjustment, dailyConfirmedAdjustment);
  for (const dailySum of orderedDailySummary) {
    dailySum.confirmedAdjustment = Math.round(adjustedDay * dailyConfirmedAdjustment);
    dailySum.confirmedCumulative += dailySum.confirmedAdjustment;
    dailySum.recoveredAdjustment = Math.round(adjustedDay * dailyRecoveredAdjustment);
    dailySum.recoveredCumulative += dailySum.recoveredAdjustment;

    adjustedDay += 1;
  }

  // Calculate active/activeCumulative (must happen after we bring forward any missing cumulative numbers)
  for (const dailySum of orderedDailySummary) {
    dailySum.activeCumulative = Math.max(0, dailySum.confirmedCumulative - dailySum.deceasedCumulative - dailySum.recoveredCumulative);
  }

  // Calculate daily incrementals that we're missing by using the cumulative numbers.
  let yesterdayTestedCumulative = 0;
  let yesterdayRecoveredCumulative = 0;
  let yesterdayCriticalCumulative = 0;
  let yesterdayActiveCumulative = 0;
  let yesterdayConfirmedCumulative = 0;
  for (const dailySum of orderedDailySummary) {
    // tested
    dailySum.tested = dailySum.testedCumulative - yesterdayTestedCumulative;
    yesterdayTestedCumulative = dailySum.testedCumulative;
    // recovered
    dailySum.recovered = dailySum.recoveredCumulative - yesterdayRecoveredCumulative;
    yesterdayRecoveredCumulative = dailySum.recoveredCumulative;
    // critical
    dailySum.critical = dailySum.criticalCumulative - yesterdayCriticalCumulative;
    yesterdayCriticalCumulative = dailySum.criticalCumulative;
    // active
    dailySum.active = dailySum.activeCumulative - yesterdayActiveCumulative;
    yesterdayActiveCumulative = Math.max(0, dailySum.activeCumulative);
    // confirmed (not necessarily needed, but we do it with this metric to ensure our applied fudge factor is reflected)
    dailySum.confirmed = dailySum.confirmedCumulative - yesterdayConfirmedCumulative;
    yesterdayConfirmedCumulative = dailySum.confirmedCumulative;
  }

  // For backwards compatibility, include deaths field. (Remove after 5/1)
  for (let i = 1; i < orderedDailySummary.length; i++) {
    const thisDay = orderedDailySummary[i];
    thisDay.deaths = thisDay.deceased;
  }

  // Calculate a rolling 3/7 day averages
  const rollingAverageValues = (values, size, key) => {
    let buffer = [];
    const averagedValues = [];

    for (const value of values) {
      buffer.push(value[key]);
      if (buffer.length > size) {
        buffer = buffer.slice(buffer.length - size);
      }

      const average = Math.floor(_.sum(buffer) / size);
      averagedValues.push(average);
    }
    return averagedValues;
  };

  const averages = {};
  const averagableKeys = [
    "confirmed",
    "confirmedCumulative",
    "deceased",
    "deceasedCumulative",
    "reportedDeceased",
    "reportedDeceasedCumulative",
    "recovered",
    "recoveredCumulative",
  ];

  for (const key of averagableKeys) {
    averages[`${key}Avg3d`] = rollingAverageValues(orderedDailySummary, 3, key);
    averages[`${key}Avg7d`] = rollingAverageValues(orderedDailySummary, 7, key);
  }

  for (let i = 0; i < orderedDailySummary.length; i++) {
    for (const key of averagableKeys) {
      orderedDailySummary[i][`${key}Avg3d`] = averages[`${key}Avg3d`][i];
      orderedDailySummary[i][`${key}Avg7d`] = averages[`${key}Avg7d`][i];
    }
  }

  orderedDailySummary = verify.verifyDailySummary(orderedDailySummary);
  return orderedDailySummary;
};

const PREFECTURE_SUMMARY_TEMPLATE = {
  confirmed: 0,
  dailyConfirmedCount: [],
  dailyConfirmedStartDate: null,
  newlyConfirmed: 0,
  yesterdayConfirmed: 0,
  dailyDeceasedCount: [],
  dailyDeceasedStartDate: null,
  dailyRecoveredCumulative: [],
  dailyRecoveredStartDate: null,
  deceased: 0,
  cruisePassenger: 0,
  recovered: 0,
  critical: 0,
  tested: 0,
  active: 0,

  // These need to be separately reset ...
  patients: [],
  confirmedByCity: {},
};

// Generate the per-prefecture summary, ordered by number of confirmed cases.
//
// patients: Patients data from Patient Data spreadsheet.
// manualPrefectureData: List of rows from the prefecture spreadsheet.
// recoveryByPrefecture: Dict by prefecture with each obj containing keys of timestamps.
//
// @returns prefectureSummary as a dictionary.
const generatePrefectureSummary = (patients, manualPrefectureData, cruiseCounts, recoveryByPrefecture, prefectureNames) => {
  let prefectureSummary = {};

  for (const prefecture of prefectureNames) {
    prefectureSummary[prefecture] = { ...PREFECTURE_SUMMARY_TEMPLATE };
    prefectureSummary[prefecture].patients = [];
    prefectureSummary[prefecture].confirmedByCity = {};
  }

  for (const patient of patients.patients) {
    const prefectureName = patient.detectedPrefecture || patient.prefecture;

    if (typeof prefectureSummary[prefectureName] === "undefined") {
      prefectureSummary[prefectureName] = { ...PREFECTURE_SUMMARY_TEMPLATE };
      prefectureSummary[prefectureName].patients = [];
      prefectureSummary[prefectureName].confirmedByCity = {};
    }

    if (patients.format == PATIENTS_FORMAT_COVID19JAPAN) {
      const cityName = patient.detectedCityTown;

      if (patient.confirmedPatient) {
        prefectureSummary[prefectureName].confirmed += patient.patientCount || 1;
        if (cityName) {
          if (prefectureSummary[prefectureName].confirmedByCity[cityName]) {
            prefectureSummary[prefectureName].confirmedByCity[cityName] += patient.patientCount || 1;
          } else {
            prefectureSummary[prefectureName].confirmedByCity[cityName] = patient.patientCount || 1;
          }
        }

        if (patient.knownCluster && CRUISE_PASSENGER_DISEMBARKED.test(patient.knownCluster)) {
          prefectureSummary[prefectureName].cruisePassenger += patient.patientCount || 1;
        }
      }

      if (patient.patientStatus == "Deceased") {
        prefectureSummary[prefectureName].deceased += patient.patientCount || 1;
      }
      prefectureSummary[prefectureName].patients.push(patient);
    } else if (patients.format == PATIENTS_FORMAT_NHK) {
      prefectureSummary[prefectureName].confirmed += patient.dailyCases || 0;
      prefectureSummary[prefectureName].deceased += patient.dailyDeaths || 0;
      prefectureSummary[prefectureName].patients.push(patient)
    }
  }

  for (const prefectureName of _.keys(prefectureSummary)) {
    const prefecture = prefectureSummary[prefectureName];
    const firstDay = TIMELINE_FIRST_DAY;
    const daily = generateDailyStatsForPrefecture(patients.format, prefecture.patients, firstDay);
    if (daily.confirmed && daily.confirmed.length) {
      prefecture.dailyConfirmedCount = daily.confirmed;
      prefecture.dailyConfirmedStartDate = firstDay.format("YYYY-MM-DD");
      prefecture.newlyConfirmed = daily.confirmed[daily.confirmed.length - 1];
      if (daily.confirmed.length > 2) {
        prefecture.yesterdayConfirmed = daily.confirmed[daily.confirmed.length - 2];
      }
    }

    // Switch to using death announcement date rather than actual death date.
    // if (daily.deaths && daily.deaths.length) {
    //   prefecture.dailyDeceasedCount = daily.deaths
    //   prefecture.dailyDeceasedStartDate = firstDay.format('YYYY-MM-DD')
    //   prefecture.newlyDeceased = daily.deaths[daily.deaths.length - 1]
    //   if (daily.deaths.length > 2) {
    //     prefecture.yesterdayDeceased = daily.deaths[daily.deaths.length - 2]
    //   }
    // }

    if (daily.deathAnnouncements && daily.deathAnnouncements.length) {
      prefecture.dailyDeceasedCount = daily.deathAnnouncements;
      prefecture.dailyDeceasedStartDate = firstDay.format("YYYY-MM-DD");
      prefecture.newlyDeceased = daily.deathAnnouncements[daily.deathAnnouncements.length - 1];
      if (daily.deathAnnouncements.length > 2) {
        prefecture.yesterdayDeceased = daily.deathAnnouncements[daily.deathAnnouncements.length - 2];
      }
    }

    const recoveries = recoveryByPrefecture[prefectureName];
    if (recoveries) {
      const dailyRecoveries = generateDailyRecoveredForPrefecture(recoveries);
      prefecture.dailyRecoveredStartDate = dailyRecoveries.startDate;
      prefecture.dailyRecoveredCumulative = dailyRecoveries.recoveredCumulative;
      const activeCases = generateDailyActiveForPrefecture(prefecture);
      prefecture.dailyActiveStartDate = activeCases.startDate;
      prefecture.dailyActive = activeCases.dailyActive;
    }
  }

  // Apply both the recoveryAdjustment and nhkCasesCorrection to the prefecture totals.
  //
  // We do not consistently record the correction made by the prefectures to historical
  // case counts, therefore our cases total is not the same as the prefectures. So we apply
  // a manual correction to the prefecture case counts.
  //
  // There is also a discrepency in recovery numbers from MHLW against the NHK prefecture
  // case counts. We also apply a manual correction to recovery numbers when that occurs.
  // (e.g. MHLW may count more cases and more recoveries than NHK, so we need to subtract
  // that difference).
  //
  // This generally only applies to a limited set of prefectures.
  for (const row of manualPrefectureData) {
    if (prefectureSummary[row.prefecture]) {
      // Get and apply any manual adjustments to the recovery numbers to negate
      // discrepency between NHK counting and MHLW counting
      let recoveredAdjustment = safeParseInt(row.recoveryAdjustment);
      if (!recoveredAdjustment) {
        recoveredAdjustment = 0;
      }

      let confirmedAdjustment = safeParseInt(row.nhkCasesCorrection);
      if (!confirmedAdjustment) {
        confirmedAdjustment = 0;
      }

      // Apply adjustments.
      prefectureSummary[row.prefecture].confirmed = safeParseInt(prefectureSummary[row.prefecture].confirmed) + confirmedAdjustment;
      prefectureSummary[row.prefecture].confirmedAdjustment = confirmedAdjustment;
      prefectureSummary[row.prefecture].recovered = safeParseInt(row.recovered) + recoveredAdjustment;
      prefectureSummary[row.prefecture].recoveredAdjustment = recoveredAdjustment;

      prefectureSummary[row.prefecture].reinfected = safeParseInt(row.reinfected);
      prefectureSummary[row.prefecture].name_ja = row.prefectureJa;
    }
  }

  // Strip out patients list
  prefectureSummary = _.mapValues(prefectureSummary, (v) => {
    const stripped = _.omit(v, "patients");
    return stripped;
  });

  // Incorporate cruise ship patients.
  if (cruiseCounts) {
    const cruiseSummaries = generateCruiseShipPrefectureSummary(cruiseCounts);
    prefectureSummary["Nagasaki Cruise Ship"] = cruiseSummaries.nagasakiCruise;
    prefectureSummary["Diamond Princess Cruise Ship"] = cruiseSummaries.diamondPrincess;
  }

  // Give Port of Entry and Unspecified identifiers
  if (prefectureSummary["Port Quarantine"]) {
    prefectureSummary["Port Quarantine"].identifier = "port-of-entry";
  }
  if (prefectureSummary.Unspecified) {
    prefectureSummary.Unspecified.identifier = "unspecified";
  }

  // Mark pseudo-prefectures as such (e.g. Unspecified, Port of Entry, Diamond Princess, Nagasaki Cruise Ship)
  prefectureSummary = _.mapValues(prefectureSummary, (v, k) => {
    if (prefectureNames.indexOf(k) == -1) {
      v.pseudoPrefecture = true;
    }
    return v;
  });

  // Backwards-compatiblilty deaths -> deceased (remove after 5/1)
  prefectureSummary = _.mapValues(prefectureSummary, (v, k) => {
    v.deaths = v.deceased;
    return v;
  });

  // Calculate active patients
  prefectureSummary = _.mapValues(prefectureSummary, (v, k) => {
    let { reinfected } = v;
    if (typeof reinfected !== "number") {
      reinfected = 0;
    }
    v.active = Math.max(v.confirmed - v.deceased - v.recovered + reinfected, 0);
    return v;
  });

  return _.map(
    _.reverse(
      _.sortBy(
        _.toPairs(prefectureSummary),
        [(a) => a[1].confirmed],
      ),
    ),
    (v) => { const o = v[1]; o.name = v[0]; return o; },
  );
};

// Generates pseudo prefecture summaries for cruise passengers.
const generateCruiseShipPrefectureSummary = (cruiseCounts) => {
  const diamondPrincess = _.assign({}, PREFECTURE_SUMMARY_TEMPLATE);
  diamondPrincess.name = "Diamond Princess Cruise Ship";
  diamondPrincess.identifier = "diamond-princess";
  diamondPrincess.name_ja = "ダイヤモンド・プリンセス";
  const nagasakiCruise = _.assign({}, PREFECTURE_SUMMARY_TEMPLATE);
  nagasakiCruise.name = "Nagasaki Cruise Ship";
  nagasakiCruise.identifier = "nagasaki-cruise";
  nagasakiCruise.name_ja = "長崎のクルーズ船";

  const diamondPrincessConfirmedCounts = [0];
  const diamondPrincessDeceasedCounts = [0];
  const nagasakiConfirmedCounts = [0];
  const nagasakiDeceasedCounts = [0];
  let diamondPrincessLastConfirmed = 0;
  let diamondPrincessLastDeceased = 0;
  let nagasakiLastConfirmed = 0;
  let nagasakiLastDeceased = 0;

  // Generate per-day increment data.
  const firstDay = moment("2020-02-04");
  const lastDay = moment().utcOffset(540);
  let day = moment(firstDay);
  const cruiseCountsByDay = _.fromPairs(_.map(cruiseCounts, (o) => [o.date, o]));

  while (day <= lastDay) {
    const dateString = day.format("YYYY-MM-DD");
    const row = cruiseCountsByDay[dateString];
    if (row) {
      if (row.dpConfirmed) {
        const diff = safeParseInt(row.dpConfirmed) - diamondPrincessLastConfirmed;
        diamondPrincessLastConfirmed = safeParseInt(row.dpConfirmed);
        diamondPrincessConfirmedCounts.push(diff);
      } else {
        diamondPrincessConfirmedCounts.push(0);
      }
      if (row.dpDeceased) {
        const diff = safeParseInt(row.dpDeceased) - diamondPrincessLastDeceased;
        diamondPrincessLastDeceased = safeParseInt(row.dpDeceased);
        diamondPrincessDeceasedCounts.push(diff);
      } else {
        diamondPrincessDeceasedCounts.push(0);
      }
      if (row.nagasakiConfirmed) {
        const diff = safeParseInt(row.nagasakiConfirmed) - nagasakiLastConfirmed;
        nagasakiLastConfirmed = safeParseInt(row.nagasakiConfirmed);
        nagasakiConfirmedCounts.push(diff);
      } else {
        nagasakiConfirmedCounts.push(0);
      }
      if (row.nagasakiDeceased) {
        const diff = safeParseInt(row.nagasakiDeceased) - nagasakiLastDeceased;
        nagasakiLastDeceased = safeParseInt(row.nagasakiDeceased);
        nagasakiDeceasedCounts.push(diff);
      } else {
        nagasakiDeceasedCounts.push(0);
      }
    } else {
      // no data.
      diamondPrincessConfirmedCounts.push(0);
      diamondPrincessDeceasedCounts.push(0);
      nagasakiConfirmedCounts.push(0);
      nagasakiDeceasedCounts.push(0);
    }
    day = day.add(1, "day");
  }

  diamondPrincess.dailyConfirmedCount = diamondPrincessConfirmedCounts;
  diamondPrincess.dailyConfirmedStartDate = firstDay.format("YYYY-MM-DD");
  diamondPrincess.dailyDeceasedCount = diamondPrincessDeceasedCounts;
  diamondPrincess.dailyDeceasedStartDate = firstDay.format("YYYY-MM-DD");
  nagasakiCruise.dailyConfirmedCount = nagasakiConfirmedCounts;
  nagasakiCruise.dailyConfirmedStartDate = firstDay.format("YYYY-MM-DD");
  nagasakiCruise.dailyDeceasedCount = nagasakiDeceasedCounts;
  nagasakiCruise.dailyDeceasedStartDate = firstDay.format("YYYY-MM-DD");

  diamondPrincess.newlyConfirmed = diamondPrincessConfirmedCounts[diamondPrincessConfirmedCounts.length - 1];
  if (diamondPrincessConfirmedCounts.length > 2) {
    diamondPrincess.yesterdayConfirmed = diamondPrincessConfirmedCounts[diamondPrincessConfirmedCounts.length - 2];
  }

  diamondPrincess.newlyDeceased = diamondPrincessDeceasedCounts[diamondPrincessDeceasedCounts.length - 1];
  if (diamondPrincessDeceasedCounts.length > 2) {
    diamondPrincess.newlyDeceased = diamondPrincessDeceasedCounts[diamondPrincessDeceasedCounts.length - 2];
  }

  nagasakiCruise.newlyConfirmed = nagasakiConfirmedCounts[nagasakiConfirmedCounts.length - 1];
  if (nagasakiConfirmedCounts.length > 2) {
    nagasakiCruise.yesterdayConfirmed = nagasakiConfirmedCounts[nagasakiConfirmedCounts.length - 2];
  }

  nagasakiCruise.newlyDeceased = nagasakiDeceasedCounts[nagasakiDeceasedCounts.length - 1];
  if (nagasakiDeceasedCounts.length > 2) {
    nagasakiCruise.newlyDeceased = nagasakiDeceasedCounts[nagasakiDeceasedCounts.length - 2];
  }

  // Take the last row of data and use that as the total for the prefecture.
  const latestRow = _.last(cruiseCounts);
  diamondPrincess.confirmed = safeParseInt(latestRow.dpConfirmed);
  diamondPrincess.recovered = safeParseInt(latestRow.dpRecovered);
  diamondPrincess.deceased = safeParseInt(latestRow.dpDeceased);
  diamondPrincess.critical = safeParseInt(latestRow.dpCritical);
  diamondPrincess.tested = safeParseInt(latestRow.dpTested);
  diamondPrincess.reinfected = 0;
  nagasakiCruise.confirmed = safeParseInt(latestRow.nagasakiConfirmed);
  nagasakiCruise.recovered = safeParseInt(latestRow.nagasakiRecovered);
  nagasakiCruise.deceased = safeParseInt(latestRow.nagasakiDeceased);
  nagasakiCruise.critical = safeParseInt(latestRow.nagasakiCritical);
  nagasakiCruise.tested = safeParseInt(latestRow.nagasakiTested);
  nagasakiCruise.reinfected = 0;

  return { diamondPrincess, nagasakiCruise };
};

const generateRegionSummary = (prefectureSummary, regionPrefectures) => {
  const REGION_TEMPLATE = {
    confirmed: 0,
    newlyConfirmed: 0,
    yesterdayConfirmed: 0,
    deceased: 0,
    recovered: 0,
    critical: 0,
    tested: 0,
    active: 0,
    dailyConfirmedCount: [],
    dailyConfirmedStartDate: null,
  };

  const regionSummary = {};
  for (const regionName of Object.keys(regionPrefectures)) {
    regionSummary[regionName] = { ...REGION_TEMPLATE };
    regionSummary[regionName].prefectures = regionPrefectures[regionName];
    regionSummary[regionName].name = regionName;
    regionSummary[regionName].dailyConfirmedStartDate = TIMELINE_FIRST_DAY.format("YYYY-MM-DD");

    for (const prefectureName of regionPrefectures[regionName]) {
      const prefecture = _.find(prefectureSummary, _.matchesProperty("name", prefectureName));
      if (prefecture) {
        for (const metric of Object.keys(REGION_TEMPLATE)) {
          if (typeof prefecture[metric] === "number") {
            regionSummary[regionName][metric] += prefecture[metric];
          }
        }
        if (regionSummary[regionName].dailyConfirmedCount.length < 1) {
          regionSummary[regionName].dailyConfirmedCount = [...prefecture.dailyConfirmedCount];
        }
        for (let i = 0; i < prefecture.dailyConfirmedCount.length; i++) {
          regionSummary[regionName].dailyConfirmedCount[i] += prefecture.dailyConfirmedCount[i];
        }
      }
    }
  }

  // Convert regionSummary in to a sorted array.
  return _.orderBy(_.values(regionSummary),
    ["active", "newlyConfirmed"],
    ["desc", "desc"]);
};

const generateDailyStatsForPrefecture = (patientFormat, patients, firstDay) => {
  const lastDay = moment().utcOffset(540);
  let day = moment(firstDay);
  const dailyConfirmed = [];
  const dailyDeaths = [];
  const dailyDeathAnnoucements = [];

  while (day <= lastDay) {
    const dayString = day.format("YYYY-MM-DD");
    if (patientFormat == PATIENTS_FORMAT_COVID19JAPAN) { // Old data format
      const confirmed = _.filter(patients, (o) => o.dateAnnounced == dayString && o.confirmedPatient);
      dailyConfirmed.push(_.sumBy(confirmed, (v) => v.patientCount || 1));
      const deaths = _.filter(patients, (o) => o.deceasedDate == dayString && o.patientStatus == "Deceased");
      dailyDeaths.push(_.sumBy(deaths, (v) => v.patientCount || 1));

      const deathsAnnounced = _.filter(patients, (o) => {
        if (o.patientStatus == "Deceased") {
          if (o.deceasedReportedDate) {
            if (o.deceasedReportedDate == dayString) {
              return true;
            }
            return false;
          } if (o.dateAnnounced && o.dateAnnounced == dayString) {
            return true;
          }
          return false;
        }
      });

      dailyDeathAnnoucements.push(_.sumBy(deathsAnnounced, (v) => v.patientCount || 1));
    } else if (patientFormat == PATIENTS_FORMAT_NHK) {  // NHK data format
      const patientsForDay = _.filter(patients, (o) => o.dateAnnounced == dayString);
      if (patientsForDay.length > 0) {
        dailyConfirmed.push(patientsForDay[0].dailyCases)
        dailyDeathAnnoucements.push(patientsForDay[0].dailyDeaths)
        dailyDeaths.push(patientsForDay[0].dailyDeaths)
      }
    }
    day = day.add(1, "days");
  }
  return { confirmed: dailyConfirmed, deaths: dailyDeaths, deathAnnouncements: dailyDeathAnnoucements };
};

const generateDailyRecoveredForPrefecture = (recoveries) => {
  const dates = _.orderBy(_.keys(recoveries));
  const firstDay = moment(dates[0]);
  const lastDay = moment().utcOffset(540);

  const cumulativeRecoveries = [];
  let day = moment(firstDay);
  let lastValue = 0;
  while (day < lastDay) {
    const val = safeParseInt(recoveries[day.format("YYYYMMDD")]);
    if (val) {
      cumulativeRecoveries.push(val);
      lastValue = val;
    } else {
      cumulativeRecoveries.push(lastValue);
    }
    day = day.add(1, "days");
  }

  return {
    startDate: firstDay.format("YYYY-MM-DD"),
    recoveredCumulative: cumulativeRecoveries,
  };
};

const generateDailyActiveForPrefecture = (prefecture) => {
  const startDate = prefecture.dailyRecoveredStartDate;
  const firstDay = moment(startDate);
  const lastDay = moment().utcOffset(540);

  const dailyActives = [];
  for (let daysFromToday = lastDay.diff(firstDay, "days");
    daysFromToday >= 0;
    daysFromToday--) {
    const recoveredIndex = prefecture.dailyRecoveredCumulative.length - 1 - daysFromToday;
    const cumulativeRecovered = prefecture.dailyRecoveredCumulative[recoveredIndex];
    const confirmedIndex = prefecture.dailyConfirmedCount.length - 1 - daysFromToday;
    const cumulativeConfirmed = _.sum(_.slice(prefecture.dailyConfirmedCount, 0, confirmedIndex));
    const cumulativeDeceased = _.sum(_.slice(prefecture.dailyDeceasedCount, 0, confirmedIndex));
    const active = cumulativeConfirmed - cumulativeDeceased - cumulativeRecovered;
    dailyActives.push(active);
  }

  return {
    startDate,
    dailyActive: dailyActives,
  };
};

exports.summarize = summarize;

exports.generateDailyActiveForPrefecture = generateDailyActiveForPrefecture;
