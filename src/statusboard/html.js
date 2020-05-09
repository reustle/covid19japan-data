const cheerio = require('cheerio')
const _ = require('lodash')

// Using our proxy in order to fetch files with permissive CORS headers
// so we can do the manipulation from the browser.
const USE_PROXY = true

export const fetchSummaryFromHtml = (url, crawl, fetchImpl) => {
  let fetchUrl = url
  if (USE_PROXY) {
    fetchUrl = 'https://us-central1-covid19-analysis.cloudfunctions.net/proxy?url=' +
      encodeURIComponent(url)
  }  
  if (!fetchImpl) {
    fetchImpl = window.fetch
  }

  return fetchImpl(fetchUrl)
    .then(response => response.text())
    .then(text =>  {
      let dom = cheerio.load(text)
      return crawl(dom)
    })
}

