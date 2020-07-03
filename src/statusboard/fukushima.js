const cheerio = require('cheerio')
const _ = require('lodash')
const { fetchPatients } = require('./csv.js')
const { urlWithProxy } = require('./proxy.js')

const listFiles = (url, pattern, fetcher) => {
  let fetchUrl = urlWithProxy(url)
  return fetcher(fetchUrl)
    .then(response => response.text())
    .then(html => {
      let dom = cheerio.load(html)
      let links = dom('tr a')
      let fileURLs = []
      links.each((i, link) => {
        let href = link.attribs['href']
        if (href.match(pattern)) {
          fileURLs.push(url + href)
         }
      })
      return fileURLs
    })
}

const latestFukushimaCSV = (csvdirURL, fetcher) => {
  return listFiles(csvdirURL, new RegExp('070009_fukushima_covid19_patients_([0-9]+).csv'), fetcher)
    .then(urls => {
      let orderedURLs = _.reverse(_.sortBy(urls))
      return orderedURLs[0]
    })
}

export const fetchFukushimaPatients = (csvdirURL, encoding, fetcher) => {
  return latestFukushimaCSV(csvdirURL, fetcher)
    .then(latestURL => {
      return fetchPatients(latestURL, encoding, fetcher)
    })
}