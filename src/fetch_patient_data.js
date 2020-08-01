const _ = require('lodash')
const FetchSheet = require('./fetch_sheet.js')

const numberPattern = /[0-9]+$/
const shortDatePattern = /([0-9]+)\/([0-9]+)/

// Post processes the data to normalize field names etc.
const postProcessData = (rows) => {

  // Check validity of the row.
  const isValidRow = row => {
    if (!row.patientId || row.patientId == '' || typeof row === 'undefined') { return false }
    if (!row.detectedPrefecture) { return false }
    if (!row.dateAnnounced) { return false }
    return true
  }

  const transformRow = row => {
    const normalizeNumber = n => {
      if (isNaN(parseInt(n))) { return -1 }
      return parseInt(n)
    }

    const normalizeDate = n => {
      if (!n) {
        return n
      }
      return normalizeFixedWidthNumbers(n.replace('ｰ', '-'))
    }

    const normalizeFixedWidthNumbers = v => {
      return v.replace(/０/g, '0')
       .replace(/１/g, '1')
       .replace(/２/g, '2')
       .replace(/３/g, '3')
       .replace(/４/g, '4')
       .replace(/５/g, '5')
       .replace(/６/g, '6')
       .replace(/７/g, '7')
       .replace(/８/g, '8')
       .replace(/９/g, '9')
    }

    // Converts the number into a string, if possible.
    const normalizeId = n => {
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

    // Parse short date
    const parseShortDate = v => {
      if (v) {
        let shortDateMatch = v.match(shortDatePattern)
        if (shortDateMatch) {
          let month = shortDateMatch[1].padStart(2, '0')
          let day = shortDateMatch[2].padStart(2, '0')
          return `2020-${month}-${day}`
        }
      }
      return v
    }

    let transformedRow = {
      'patientId': normalizeId(row.patientNumber),
      'dateAnnounced': normalizeDate(row.dateAnnounced),
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
      'prefectureSourceURL': row.prefectureSourceURL,
      'citySourceURL': row.citySourceURL,
      'deathSourceURL': row.deathSourceURL,
      'charterFlightPassenger': row.charterFlightPassenger,
      'cruisePassengerDisembarked': row.cruisePassengerDisembarked,
      'detectedAtPort': row.detectedAtPort,
      'deceasedDate': parseShortDate(row.deceased),
      'deceasedReportedDate': parseShortDate(row.deathReportedDate),
      'sourceURL': row.sourceS,
      'prefectureURL': row.prefectureURLAuto,
      'cityURL': row.cityURLAuto,
      'deathURL': row.deathURLAuto
    }

    // filter empty cells.
    transformedRow = _.pickBy(transformedRow, (v, k) => {
      if (v === '' || v === false || typeof v === 'undefined') {
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

    // If the patient is deceased, but we don't know the date they died, use the dateAnnounced for now.
    if (transformedRow.patientStatus == 'Deceased') {
      if (typeof transformedRow.deceasedDate === 'undefined' || !transformedRow.deceasedDate) {
        transformedRow.deceasedDate = transformedRow.dateAnnounced
      }
    }

    return transformedRow
  }

  const filteredRows = _.filter(_.map(rows, transformRow), isValidRow)
  return filteredRows
}

const valuesFromCellObject = (cellObjectRows) => {
  const rowTransformer = (row) => {
    let transformed = {}
    for (let k of _.keys(row)) {
      let v = row[k]
      transformed[k] = v.formattedValue

      if (k == 'prefecturePatientNumber' && v.hyperlink) {
        transformed['prefectureSourceURL'] = v.hyperlink
      }
      if (k == 'cityPatientNumber' && v.hyperlink) {
        transformed['citySourceURL'] = v.hyperlink
      }
      if (k == 'deceased' && v.hyperlink) {
        transformed['deathSourceURL'] = v.hyperlink
      }
      if (k == 'deathReportedDate' && v.hyperlink) {
        transformed['deathSourceURL'] = v.hyperlink
      }
    }
    return transformed
  }

  const isValidRow = (row) => {
    if (!row) { return false }
    if (typeof row.patientNumber === 'undefined' || row.patientNumber == '') { return false }
    return true
  }

  return _.filter(_.map(cellObjectRows, rowTransformer), isValidRow)
}


const fetchPatientData = async (sheetId, sheetName) => {
  return FetchSheet.fetchRows(sheetId, sheetName)
    .then(data => {
      return postProcessData(data)
    })
}

// Fetching using the new fetchSheets API.
const fetchPatientDataFromSheets = async (sheets) => {
  return FetchSheet.fetchSheets(sheets)
    .then(responses => {
      let allPatients = []
      for (let sheets of responses) {
        for (let rowsOfSheet of sheets) {
          const patients = postProcessData(valuesFromCellObject(rowsOfSheet))
          allPatients = allPatients.concat(patients)
        }
      }
      return allPatients
    })
}

exports.fetchPatientData = fetchPatientData;
exports.fetchPatientDataFromSheets = fetchPatientDataFromSheets;
