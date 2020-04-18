const express = require('express')
const app = express()
const proxy = require('./functions/proxy.js')

let port = process.env.PORT || 3998

app.get('/proxy', (req, res) => {
  proxy.fetch(req, res)
})

var listener = app.listen(port, function () {
  console.log('listening on port ' + listener.address().port);
  console.log('http://localhost:' + listener.address().port);
});
