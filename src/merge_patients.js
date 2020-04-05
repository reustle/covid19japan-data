const _ = require('lodash')

const mergePatients = (patientLists) => {
  let merged = _.flatten(patientLists)
  let patientsWithoutIds = _.filter(merged, v => { return (v.patientId == -1)})
  let patientsWithIds = _.uniqBy(_.sortBy(_.filter(merged, v => { return (v.patientId != -1)}), ['patientId', 'dateAnnounced']), 'patientId')
  return _.flatten([patientsWithIds, patientsWithoutIds])
}

exports.mergePatients = mergePatients
