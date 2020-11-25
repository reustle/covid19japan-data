const cheerio = require('cheerio')
const _ = require('lodash')
const { urlWithProxy } = require('./proxy.js')


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

const parseJapaneseNumber = (v) => {
  let num = normalizeFixedWidthNumbers(v)
  const tenThousandPattern = new RegExp('([0-9]+)万([0-9]+)', 'iu')
  const tenThousandMatch = num.match(tenThousandPattern)
  if (tenThousandMatch) {
    return parseInt(tenThousandMatch[1]) * 10000 + parseInt(tenThousandMatch[2])
  }
  return parseInt(num)
}

const extractDailySummary = (url, fetchImpl) => {
  url = urlWithProxy(url)
  console.log(url)
  if (!fetchImpl) {
    fetchImpl = window.fetch
  }
  return fetchImpl(url)
    .then(response => response.text())
    .then(text =>  {
      let values = {
        prefectureCounts: {}
      }
      let dom = cheerio.load(text)
      let contents = dom('section.content--detail-main').text()

      const prefecturePattern = new RegExp('▽([^▽ ]+?)は[※]?([0-9０-９万]+)人', 'igu')
      let prefectureMatches = contents.matchAll(prefecturePattern)
      if (prefectureMatches) {
        for (const prefectureMatch of prefectureMatches) {
          //console.log(prefectureMatch)
          // Sometimes prefectures are comma separated.
          const multiPrefectures = prefectureMatch[1].split('、')
          if (multiPrefectures.length == 1) {
            values.prefectureCounts[prefectureMatch[1]] = parseJapaneseNumber(prefectureMatch[2])
          } else {
            for (let multiPrefecture of multiPrefectures) {

              values.prefectureCounts[multiPrefecture.trim()] = parseJapaneseNumber(prefectureMatch[2])
            }
          }
        }
      }

      const portAndQuartantine = new RegExp('空港の検疫で.*?([0-9０-９万]+)人', 'iu')
      let portMatch = contents.match(portAndQuartantine)
      if (portMatch) {
        values.portQuarantineCount = parseJapaneseNumber(portMatch[1])
      }

      const totalPatients = new RegExp('日本で感染が確認された人は.*?([0-9０-９万]+)人', 'iu')
      let totalMatch = contents.match(totalPatients)
      if (totalMatch) {
        values.totalCount = parseJapaneseNumber(totalMatch[1])
      }

      const deathsPattern = new RegExp('亡くなった人は.*国内で感染した人が([0-9０-９万]+)人', 'iu')
      let deathsMatch = contents.match(deathsPattern)
      if (deathsMatch) {
        values.deceased = parseJapaneseNumber(deathsMatch[1])
      }

      const criticalPatientsPattern = new RegExp('重症者は.*?([0-9０-９万]+)人', 'iu')
      let criticalMatch = contents.match(criticalPatientsPattern)
      if (criticalMatch) {
        values.critical = parseJapaneseNumber(criticalMatch[1])
      }

      const recoveredJapanPattern = new RegExp('症状が改善して退院した.*国内で感染した人が([0-9０-９万]+)人', 'iu')
      let recoveredJapan = contents.match(recoveredJapanPattern)
      if (recoveredJapan) {
        values.recoveredJapan = parseJapaneseNumber(recoveredJapan[1])
      }

      const recoveredTotalPattern = new RegExp('症状が改善して退院した.*クルーズ船の乗客・乗員が([0-9０-９万]+)人の合わせて([0-9０-９万]+)', 'iu')
      let recoveredTotal = contents.match(recoveredTotalPattern)
      if (recoveredTotal) {
        values.recoveredTotal = parseJapaneseNumber(recoveredTotal[2])
      }

      console.log(values)

      return values
    })
}

const prefectureCountsInEnglish = (result) => {
  const prefectureCountsInEn =  _.mapKeys(result.prefectureCounts, (v, k) => { return prefectureLookup[k] })
  const translatedResults = Object.assign({}, result)
  translatedResults.prefectureCounts = prefectureCountsInEn
  return translatedResults
}


const sortedPrefectureCounts = (values) => {
  let prefectureCountsInEnglish = prefectureCountsInEnglish(values)
  //console.log(prefectureCountsInEnglish)
  let counts = []
  for (let prefectureName of _.sortBy(_.values(prefectureLookup))) {
    let count = prefectureCountsInEnglish[prefectureName]
    if (!count) {
      count = 0
    }
    counts.push(count)
  }
  return counts
}

exports.extractDailySummary = extractDailySummary
exports.sortedPrefectureCounts = sortedPrefectureCounts
exports.prefectureLookup = prefectureLookup
exports.prefectureCountsInEnglish = prefectureCountsInEnglish