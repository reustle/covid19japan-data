// Firebase function that acts as a proxy to get around missing CORS settings
// when fetching.

const functions = require('firebase-functions');
const proxy = require('./proxy.js');
const status = require('./status.js');

exports.proxy = functions.https.onRequest((request, response) => {
  proxy.fetch(request, response)
})

exports.status = functions.https.onRequest((request, response) => {
  status.setStatus(request, response)
})
