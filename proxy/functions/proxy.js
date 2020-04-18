const fetch = require('node-fetch')

exports.fetch = (request, response) => {
  let url = request.query.url
  if (!url) {
    response.status(500)
    return
  }

  fetch(url)
    .then(proxyResponse => {
      response.status(proxyResponse.status)
      response.set('Access-Control-Allow-Origin', '*')
      const contentType = proxyResponse.headers.get('Content-Type')
      if (contentType) {
        response.set('Content-Type', contentType.split(' ')[0])
      }
      // if (url.endsWith('csv') || url.endswith('json')) {
      //   response.set('Content-Type', 'text/plain')
      // }
      return proxyResponse.arrayBuffer()
    })
    .then(arrayBuffer => {
      response.send(new Buffer(new Uint8Array(arrayBuffer)))
      return
    })
    .catch(err => {
      response.status(500)
      console.log(err)
    })
}