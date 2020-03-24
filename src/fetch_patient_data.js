const drive = require('drive-db')
const fs = require('fs')
const _ = require('lodash')

const SHEET = '1jfB4muWkzKTR0daklmf8D5F0Uf_IYAgcx_-Ij9McClQ'
const SHEET_PATIENT_DATA_TAB = 1

// Post processes the data to normalize field names etc.
const postProcessData = (rawData) => {

  // Check validity of the row.
  const filterRow = row => {
    if (!row.patientnumber || isNaN(parseInt(row.patientNumber))) { return false }
    return true
  }

  const transformRow = row => {
    const normalizeNumber = n => {
      if (isNaN(parseInt(n))) { return -1 }
      return parseInt(n)
    }

    const unspecifiedToBlank = v => {
      if (v == 'Unspecified') return ''
      return v
    }

    return {
      'patientId': parseInt(row.patientnumber),
      'dateAnnounced': parseInt(row.dateannounced),
      'ageBracket': normalizeNumber(row.agebracket),
      'gender': unspecifiedToBlank(row.gender),
      'residence': row.residencecityprefecture,
      'detectedCityTown': row.detectedcity,
      'detectedPrefecture': row.detectedprefecture,
      'patientStatus': row.status,
      'notes': row.notes,
      'knownCluster': row.knowncluster,
      'relatedPatients': row.relatedPatients,
      'mhlwPatientNumber': row.mhlworigpatientnumber,
      'prefecturePatientNumber': row.prefecturepatientnumber,
      'cityPrefectureNumber': row.citypatientnumber,
      'isCharterFlightPassenger': row.charterflightpassenger,
      'isDisembarkedCruisePassenger': row.cruisepassengerdisembarked,
      'isInfectedOnboardCruisePassenger': row.cruisepassengerinfectedonboard,
      'isQuarantineOfficer': row.cruisequarantineofficer,
      'isDetectedAtPort': row.detectedatport,
      'sourceURL': row.sources,
      'prefectureSourceURL': row.prefectureurlauto
    }
  }

  return _.map(_.filter(rawData), transformRow)
}


async function run(destinationFilename) {
  console.log('Fetching data...')
  drive({sheet: SHEET, tab: SHEET_PATIENT_DATA_TAB})
    .then(db => {
      fs.writeFileSync(destinationFilename, JSON.stringify(postProcessData(db)))
    })
}

exports.run = run;
