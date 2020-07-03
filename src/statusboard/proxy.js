const USE_PROXY = true

const urlWithProxy = (url) => {
  if (USE_PROXY) {
    return'https://us-central1-covid19-analysis.cloudfunctions.net/proxy?url=' +
      encodeURIComponent(url)
  }  
  return url
}


exports.urlWithProxy = urlWithProxy