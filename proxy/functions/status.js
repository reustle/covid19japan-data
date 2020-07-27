const admin = require('firebase-admin');
admin.initializeApp();


exports.setStatus = async (request, response) => {
  let status = request.query.status
  if (!status) {
    response.status(500)
    return
  }

  const db = admin.firestore();
  const docRef = db.collection('status').doc('latest');
  await docRef.set({
    status: status,
  });
}