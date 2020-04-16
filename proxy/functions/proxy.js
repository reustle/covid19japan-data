const fetch = require('node-fetch')

exports.fetch = (request, response) => {
  let url = request.query.url
  if (!url) {
    response.status(500)
    return
  }

  fetch(url)
    .then(proxyResponse => {
      console.log(proxyResponse)
      response.status(proxyResponse.status)
      response.set('Access-Control-Allow-Origin', '*')
      const contentType = proxyResponse.headers.get('Content-Type')
      if (contentType) {
        response.set('Content-Type', contentType)
      }

      return proxyResponse.text()
    })
    .then(text => {
      response.send(text)
      return
    })
    .catch(err => {
      response.status(500)
      console.log(err)
    })
}