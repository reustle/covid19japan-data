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

  console.log({status: status, name: name})

  const db = admin.firestore();
  const docRef = db.collection('status').doc(name);
  const writeResult = await docRef.set({status: status})
  response.json({result: writeResult, status: status})
}