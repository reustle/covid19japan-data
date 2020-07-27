const admin = require('firebase-admin');
admin.initializeApp();

exports.setStatus = async (request, response) => {
  let name = 'latest'
  if (request.query.name) {
    name = request.query.name
  }
  if (request.body.name) {
    name = request.body.name
  }

  let status = 'blank'
  if (request.query.status) {
    status = request.query.status
  }
  if (request.body.status) {
    status = request.body.status
  }

  const jstOffset = 9 * 60 * 60 * 1000
  let utcTimestamp = new Date(new Date().toUTCString())
  let jstTimestamp = new Date()
  jstTimestamp.setTime((utcTimestamp.getTime() + jstOffset))

  let statusInfo = {
    status: status,
    utcTimestamp: utcTimestamp.toISOString(),
    japanTimestamp: jstTimestamp.toISOString()
  }

  const db = admin.firestore();
  const docRef = db.collection('status').doc(name);
  const writeResult = await docRef.set(statusInfo)
  response.json({result: writeResult, status: statusInfo})
}