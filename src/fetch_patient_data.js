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

    let transformedRow = {
      'patientId': parseInt(row.patientnumber),
      'dateAnnounced': row.dateannounced,
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
      'prefectureSourceURL': row.prefectureurlauto,
      'charterFlightPassenger': row.charterflightpassenger,
      'cruisePassengerDisembarked': row.cruisepassengerdisembarked,
      'cruisePassengerInfectedOnboard': row.cruisepassengerinfectedonboard,
      'cruiseQuarantineOfficer': row.cruisequarantineofficer,
      'detectedAtPort': row.detectedatport,
      'sourceURL': row.sources,
    }

    // filter empty cells.
    transformedRow = _.pickBy(transformedRow, (v, k) => {
      if (v == '') {
        return false
      }
      return true
    })

    // convert boolean fields
    let booleanFields = [ 
      'charterFlightPassenger', 
      'cruisePassengerDisembarked', 
      'cruisePassengerInfectedOnboard',
      'cruiseQuarantineOfficer',
      'detectedAtPort'
    ]
    transformedRow = _.mapValues(transformedRow, (v, k) => {
      if (booleanFields.indexOf(k) != -1) {
        return (v == '1')
      }
      return v
    })

    return transformedRow
  }

  return _.map(_.filter(rawData), transformRow)
}


async function run(destinationFilename) {
  console.log('Fetching data...')
  drive({sheet: SHEET, tab: SHEET_PATIENT_DATA_TAB})
    .then(db => {
      fs.writeFileSync(destinationFilename, JSON.stringify(postProcessData(db), null, '  '))
    })
}

exports.run = run;
