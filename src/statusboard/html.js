const cheerio = require('cheerio')
const _ = require('lodash')
const Encoding = require('encoding-japanese')

// Using our proxy in order to fetch files with permissive CORS headers
// so we can do the manipulation from the browser.
const USE_PROXY = true

export const fetchSummaryFromHtml = (url, crawl, encoding, fetchImpl) => {
  let fetchUrl = url
  if (USE_PROXY) {
    fetchUrl = 'https://us-central1-covid19-analysis.cloudfunctions.net/proxy?url=' +
      encodeURIComponent(url)
  }  
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

