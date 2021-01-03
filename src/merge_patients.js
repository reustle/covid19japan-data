const _ = require('lodash')
const Verify = require('./verify.js')

const mergePatients = (allPatients) => {
  //const sortOrder = ['patientId', 'dateAnnounced']
  const sortOrder = ['dateAnnounced', 'patientId']

  try {
    Verify.verifyPatients(allPatients)
  } catch (e) {
    console.warn(e)
  }
  let patientsWithoutIds = _.sortBy(_.filter(allPatients, v => { return (v.patientId == -1)}), ['dateAnnounced'])
  let patientsWithIds = _.uniqBy(_.sortBy(_.filter(allPatients, v => { return (v.patientId != -1)}), sortOrder), 'patientId')
  return _.flatten([patientsWithIds, patientsWithoutIds])
}


exports.mergePatients = mergePatients
