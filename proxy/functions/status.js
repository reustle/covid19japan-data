const admin = require('firebase-admin');
admin.initializeApp();

// Example:
// https://us-central1-covid19-analysis.cloudfunctions.net/status?name=covid19japan-update
// https://us-central1-covid19-analysis.cloudfunctions.net/status?name=covid19japan-update-test&status=test%20message

exports.status = async (request, response) => {
  let name = 'latest'
  if (request.query.name) {
    name = request.query.name
  }
  if (request.body.name) {
    name = request.body.name
  }

  let status = ''
  if (request.query.status) {
    status = request.query.status
  }
  if (request.body.status) {
    status = request.body.status
  }

  if (!status || status.length < 1) {
    // read only
    const db = admin.firestore();
    db.collection('status').doc(name).get()
      .then(doc => {
        let data = doc.data()
        console.log(data)
        if (data && data.status) {
          response.send(data.status)
        } else {
          response.send(`Not found for "${name}".`)
        }
        return
      })
      .catch(err => {
        response.send(err)
      })
    return
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