const admin = require('firebase-admin');
admin.initializeApp();

exports.setStatus = async (request, response) => {
  let name = 'latest'
  if (request.query.name) {
    name = request.query.name
  }

  let status = 'blank'
  if (request.query.status) {
    status = request.query.status
  }

  const db = admin.firestore();
  const docRef = db.collection('status').doc(name);
  const writeResult = await docRef.set({status: status})
  response.json({result: writeResult, status: status})
}