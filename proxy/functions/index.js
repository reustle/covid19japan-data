const functions = require('firebase-functions');
const proxy = require('./proxy.js');

exports.proxy = functions.https.onRequest((request, response) => {
  proxy.fetch(request, response)
})