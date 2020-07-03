const cheerio = require('cheerio')
const _ = require('lodash')
const Encoding = require('encoding-japanese')

const { urlWithProxy } = require('./proxy.js')

export const fetchSummaryFromHtml = (url, crawl, encoding, fetchImpl) => {
  let fetchUrl = urlWithProxy(url)
 
  if (!fetchImpl) {
    fetchImpl = window.fetch
  }

  return fetchImpl(fetchUrl)
    .then(response => {
      if (!encoding) {
        return response.text()
      }
      return response.arrayBuffer().then(arrayBuffer => {
        let nonUnicodeArray = new Uint8Array(arrayBuffer)
        let unicodeArray = Encoding.convert(nonUnicodeArray, 'UNICODE', encoding)
        let unicodeString = Encoding.codeToString(unicodeArray)
        return unicodeString
      })
    })
    .then(text =>  {
      console.log(url)
      let dom = cheerio.load(text)
      return crawl(dom, url)
    })
}

