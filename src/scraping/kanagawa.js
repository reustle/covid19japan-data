const fetch = require('node-fetch')
const Papa = require('papaparse')
const encoding = require('encoding-japanese');

const PATIENTS_CSV = 'http://www.pref.kanagawa.jp/osirase/1369/data/csv/patient.csv'

const fetchCsv = (url) => {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(body => {
    let utf8Body = encoding.convert(body, {from:'SJIS', to:'UTF8', type:' arrayBuffer'});
    console.log(utf8Body)
     return Papa.parse(utf8Body, {header: true})
    })
   
}

fetchCsv(PATIENTS_CSV).then(patients => {
  console.log(patients.data.slice(-2))
})