const _ = require('lodash')
const FetchSheet = require('./fetch_sheet.js')

const numberPattern = /[0-9]+$/

// Post processes the data to normalize field names etc.
const postProcessData = (rawData) => {

  // Check validity of the row.
  const isValidRow = row => {
    if (!row.detectedPrefecture) { return false }
    if (!row.dateAnnounced) { return false }
    return true
  }

  const transformRow = row => {
    const normalizeNumber = n => {
      if (isNaN(parseInt(n))) { return -1 }
      return parseInt(n)
    }

    // Converts the number into a string, if possible.
    const normalizeId = n => {
      // Check if it has any number in it
      if (n == '') { return -1 }
      // Check if it has any number in it.
      if (numberPattern.test(n)) {
        return n
      }
      return -1
    }

    // Converts Gender
    const normalizeGender = v => {
      if (v == 'm' || v == 'M') {
        return 'M'
      }
      if (v == 'f' || v == 'F') {
        return 'F'
      }
      return ''
    }

    let transformedRow = {
      'patientId': normalizeId(row.patientNumber),
      'dateAnnounced': row.dateAnnounced,
      'ageBracket': normalizeNumber(row.ageBracket),
      'gender': normalizeGender(row.gender),
      'residence': row.residenceCityPrefecture,
      'detectedCityTown': row.detectedCity,
      'detectedPrefecture': row.detectedPrefecture,
      'patientStatus': row.status,
      'notes': row.notes,
      'knownCluster': row.knownCluster,
      'relatedPatients': row.relatedPatients,
      'mhlwPatientNumber': row.mhlwOrigPatientNumber,
      'prefecturePatientNumber': row.prefecturePatientNumber,
      'cityPrefectureNumber': row.cityPatientNumber,
      'prefectureSourceURL': row.prefectureUrlAuto,
      'charterFlightPassenger': row.charterFlightPassenger,
      'cruisePassengerDisembarked': row.cruisePassengerDisembarked,
      'detectedAtPort': row.detectedAtPort,
      'deceasedDate': row.deceased,
      'sourceURL': row.sourceS,
    }

    // filter empty cells.
    transformedRow = _.pickBy(transformedRow, (v, k) => {
      if (v == '' || v == false || typeof v === 'undefined') {
        return false
      }
      return true
    })

    // convert boolean fields
    let booleanFields = [ 
      'charterFlightPassenger', 
      'cruisePassengerDisembarked', 
    ]
    transformedRow = _.mapValues(transformedRow, (v, k) => {
      if (booleanFields.indexOf(k) != -1) {
        return (v == '1')
      }
      return v
    })

    // Add a field to indicate whether we count as patient or not.
    transformedRow.confirmedPatient = (transformedRow.patientId != -1)

    return transformedRow
  }

  const rows = _.filter(_.map(rawData, transformRow), isValidRow)
  return rows
}


async function fetchPatientData(sheetName) {
  return FetchSheet.fetchRows(sheetName)
    .then(data => {
      return postProcessData(data)
    })
}

exports.fetchPatientData = fetchPatientData;
