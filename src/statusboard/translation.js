// Data/Language translation methods to convert from Japanese to English.
// But also normalizes the data so it is common across the different data sources.

const citynames = require('./citynames.csv')
const _ = require('lodash')

const placeNameJaToEn = _.fromPairs(_.map(citynames, o => { return [o.ja, o.en] }))

export const normalizeFixedWidthNumbers = v => {
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

export const translatePatientId = (id) => {
  if (!id) {
    return ''
  }
  return id
}

export const translateAge = (age) => {
  age = normalizeFixedWidthNumbers(age)
  if (age == '10歳未満') {
    return '0'
  } else if (age == '10未満') {
    return '0'
  } else if (age == '未就学児') {
    return '0'
  } else if (age == '就学児') {
    return '0'
  } else if (age == '不明') {
    return ''
  } else {
    return age.replace('代', '').replace('歳', '')
  }
}

export const translateGender = (gender) => {
  if (gender == '男性' || gender == '男') {
    return 'M'
  } else if (gender == '女性' || gender == '女') {
    return 'F'
  } else {
    return ''
  }
}

export const translateDate = (date) => {
  return date.replace(/T.*[Z]?$/, '')
    .replace(' 00:00', '')
    .replace(/年/g, '-')
    .replace(/月/g, '-')
    .replace(/日/g, '')
    .replace(/\//g, '-')
}

export const translatePlaceName = (place) => {
  if (place == '調査中') {
    return ''
  }
  let englishName = placeNameJaToEn[place]
  if (!englishName) {
    return place
  }
  return englishName
}


export const translateRows = (rows) => {
  let translatedRows = _.map(rows, row => {
    let translated = {}
    for (let key of _.keys(row)) {
      if (key == 'No' || key == 'ＮＯ') {
        translated['patientId'] = translatePatientId(row[key])
      } else if (key == '公表_年月日' || key == 'リリース日' || key == '発表日' || key == '日付' || key == '公表年月日' || key == '確定日' || key == 'date') {
        translated['dateAnnounced'] = translateDate(row[key])
      } else if (key == '患者_年代' || key == '年代' || key == '患者＿年代') {
        translated['age'] = translateAge(row[key])
      } else if (key == '患者_性別' || key == '性別'  || key == '患者＿性別') {
        translated['gender'] = translateGender(row[key])
      } else if (key == '居住地' || key == '患者_居住地' || key == '住居地' || key == '患者＿居住地')  {
        translated['residence'] = translatePlaceName(row[key])
      } else if (key == '発症_年月日') {
        translated['dateSymptomatic'] = row[key]
      } else if (key == '患者_職業') {
        translated['occupation'] = row[key]
      } else if (key == '患者_状態') {
        translated['condition'] = row[key]
      } else if (key == '詳細') {
        translated['notes'] = row[key]
      } else if (key == '備考' || key == '接触状況') {
        translated['related'] = row[key]
      } else if (key == '退院') {
        translated['discharged'] = row[key]
      } else if (key == '年代・性別') {
        // Aichi merges these two together.
        const ageGenderPattern = new RegExp(/^(.*[代歳満])([男女性]+)$/)
        const match = row[key].match(ageGenderPattern)
        if (match) {
          translated['age'] = translateAge(match[1])
          translated['gender'] = translateGender(match[2])
        } else if (row[key] == '0歳男性') {
          translated['age'] = '0'
          translated['gender'] = 'M'
        } else {
          translated['age'] = translateAge(row[key])
        }

      } else {
        translated[key] = row[key]
      }
    }
    return translated
  })

  return _.filter(translatedRows, o => { return o.dateAnnounced })
}
