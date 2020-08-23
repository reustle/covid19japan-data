const fs = require('fs')
const path = require('path')
const moment = require('moment')

const expect = require('chai').expect

const Summarize = require('../src/summarize.js')

// TODO: This is terrible, probably need to simplify the code to make it more testable.
const MergePatients = require('../src/merge_patients.js')
const Prefectures = require('../src/prefectures.js')

// Load data
const loadTestData = (filename) => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', filename)))
}

const patients = MergePatients.mergePatients(loadTestData('fetchPatientDataFromSheets.json'))
const daily = loadTestData('sumByDay.json')
const prefectures = loadTestData('prefectureData.json')
const cruiseCounts = loadTestData('cruiseSumByDay.json')
const recoveries = loadTestData('recoveries.json')
const prefectureNames = Prefectures.prefectureNamesEn()
const regions = Prefectures.regionPrefectures()
const lastUpdated = moment().utcOffset(540).format()


describe('Summarize.summarize', () => {
  const summary = Summarize.summarize(patients, daily, prefectures, cruiseCounts, recoveries, prefectureNames, regions, lastUpdated)
  describe('#properties', () => {
    it('should have properties: daily, prefectures, regions', () => {
      expect(summary).to.have.property('daily')
      expect(summary).to.have.property('prefectures')
      expect(summary).to.have.property('regions')   
    })
  })

  describe('#daily', () => {
    it('should have a daily array', () => {
      expect(summary.daily).to.be.an('array')
      expect(summary.daily).to.have.lengthOf(208)  
      expect(summary.daily[207]).to.have.property('date')
      expect(summary.daily[207]['date']).to.equal('2020-08-23')

    })
  })

})