const fs = require('fs')
const _ = require('lodash')
const Papa = require('papaparse')


const prefectureLookup = _.fromPairs(_.map([
  "愛知県	Aichi",
  "秋田県	Akita",
  "青森県	Aomori",
  "千葉県	Chiba",
  "愛媛県	Ehime",
  "福井県	Fukui",
  "福岡県	Fukuoka",
  "福島県	Fukushima",
  "岐阜県	Gifu",
  "群馬県	Gunma",
  "広島県	Hiroshima",
  "北海道	Hokkaido",
  "兵庫県	Hyogo",
  "茨城県	Ibaraki",
  "石川県	Ishikawa",
  "岩手県	Iwate",
  "香川県	Kagawa",
  "鹿児島県	Kagoshima",
  "神奈川県	Kanagawa",
  "高知県	Kochi",
  "熊本県	Kumamoto",
  "京都府	Kyoto",
  "三重県	Mie",
  "宮城県	Miyagi",
  "宮崎県	Miyazaki",
  "長野県	Nagano",
  "長崎県	Nagasaki",
  "奈良県	Nara",
  "新潟県	Niigata",
  "大分県	Oita",
  "岡山県	Okayama",
  "沖縄県	Okinawa",
  "大阪府	Osaka",
  "佐賀県	Saga",
  "埼玉県	Saitama",
  "滋賀県	Shiga",
  "島根県	Shimane",
  "静岡県	Shizuoka",
  "栃木県	Tochigi",
  "徳島県	Tokushima",
  "東京都	Tokyo",
  "鳥取県	Tottori",
  "富山県	Toyama",
  "和歌山県	Wakayama",
  "山形県	Yamagata",
  "山口県	Yamaguchi",
  "山梨県	Yamanashi",
  ], v => { return v.split('\t') }))

// const existingPatientsData = fs.readFileSync(`./docs/patient_data/latest.json`)
// const existingPatients = JSON.parse(existingPatientsData)
// const osakaPatients = _.filter(existingPatients, o => { return o.detectedPrefecture == 'Tokyo' && o.patientStatus == 'Deceased' })
// console.log(_.sortBy(_.map(osakaPatients, o => { return [o.dateAnnounced, o.deceasedDate] })))
// console.log(`Count: ${osakaPatients.length}`)

_.forEach(_.sortBy(_.toPairs(prefectureLookup), v => v[1]), o => { console.log(`${o[1]},"${o[0]}"`)})


const allPrefectures = () => {
  let prefecturesCsv = fs.readFileSync('./src/datasources/prefectures.csv', 'utf8')
  let prefecturesList = Papa.parse(prefecturesCsv, {header: true})
  return _.map(prefecturesList.data, o => o.prefecture_en)
}

console.log(allPrefectures())