const fetch = require('node-fetch')
const { extractDailySummary, sortedPrefectureCounts, prefectureLookup } = require('./nhk.js')

const main = () => {
  let url = 'https://www3.nhk.or.jp/news/html/20200411/k10012381781000.html?utm_int=detail_contents_news-related_002'
  if (process.argv[2]) {
    url = process.argv[2]
    console.log(url)
  }
   extractDailySummary(url, fetch)
    .then(values => {
      let counts = sortedPrefectureCounts(values)
      console.log(counts)
    })
}

main()
