const _ = require('lodash')
const FetchSheet = require('./fetch_sheet.js')

const createTokyoDataset = async (prefectureRows) => {
  return _.map(prefectureRows, v => { 
    let dateValues = _.filter(_.toPairs(v), filterV => { return filterV[0].startsWith('2020') })
    dateValues = _.sortBy(dateValues, _.first)
    dateValues = _.map(dateValues, v => { 
      return { 
        date: _.first(v), 
        count: _.toNumber(_.last(v))
      }
    })

    return {
      'name': v.prefectureEn,
      'name_ja': v.prefecture,
      'values': dateValues
      }
    }
  )
}

const shortDateFormat = /^([0-9]+)\/([0-9]+)$/
const headerOrDateNormalizer = v => {
  let dateMatch = v.match(shortDateFormat)
  if (dateMatch) {
    let month = dateMatch[1].padStart(2, '0')
    let day = dateMatch[2].padStart(2, '0')
    return `2020-${month}-${day}`
  }
  return _.camelCase(v)
}

const fetchTokyoCounts = async () => {
  const sheetId = '1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY'
  return FetchSheet.fetchRows(sheetId, 'Tokyo Counts', headerOrDateNormalizer)
    .then(data => {
      return createTokyoDataset(data)
    })
}

exports.fetchTokyoCounts = fetchTokyoCounts;
