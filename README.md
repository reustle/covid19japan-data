# Data repository for covid19japan.com

[data.covid19japan.com](https://data.covid19japan.com)

This repository contains the JSON export of the [Live Japan Patient Database (Google Spreadsheet)](https://docs.google.com/spreadsheets/d/1jfB4muWkzKTR0daklmf8D5F0Uf_IYAgcx_-Ij9McClQ/edit#gid=0) that supports [covid19japan.com](https://covid19japan.com).

## Data Formats

### docs/patient_data/latest.json

Data is an array of patient data objects.
```
  [
    { ... patient data },
    { ... patient data },
  ]
```

Example Patient Data:
``` json
  {
    "patientId": 64,
    "dateAnnounced": "2020-02-18",
    "ageBracket": 80,
    "gender": "M",
    "residence": "Kanagawa",
    "detectedCityTown": "Sagamihara",
    "detectedPrefecture": "Kanagawa",
    "patientStatus": "Deceased",
    "notes": "Died on 3/17",
    "mhlwPatientNumber": "60",
    "prefecturePatientNumber": "Kanagawa#7",
    "prefectureSourceURL": "https://www.pref.kanagawa.jp/docs/ga4/bukanshi/occurrence.html",
    "sourceURL": "https://www3.nhk.or.jp/news/html/20200219/k10012291781000.html?utm_int=word_contents_list-items_005&word_result=%E6%96%B0%E5%9E%8B%E8%82%BA%E7%82%8E"
  },
```

| Fields | Values | Description |
| ------ | ------ | ----------- |
| patientId | Numeric | Unique identifier for patients (if this value is -1, this means it may be a duplicate row (see: ``confirmedPatient``) |
| confirmedPatient | boolean | Patient is a confirmed patient. If false, this could be a duplicate patient which we cannot identify. If this is false, do not count this patient in confirmed cases count. But it exists so that we can also tally deaths of existing patients. |
| dateAnnounced | YYYY-MM-DD | Date patient was announced to have tested positive |
| ageBracket | Numeric | Age bracket (40 mean 40-49). -1 for unspecified |
| gender | M/F/Unspecified | |
| residence | String | City/Town, Prefecture (not consistent) |
| detectedCityTown | City/Town or Blank | City/Town patient was detected in |
| detectedPrefecture | Prefecture Name, or "Unspecified" or "Port of Entry" | Prefecture patient was detected in. |
| patientStatus | Unspecified, Hospitalized, Deceased, Discharged, Recovered | Condition of patient (Discharged and Recovered are similar) |
| mhlwPatientNumber | Numeric | Identifier given by MHLW, obseleted by Prefecture number |
| prefecturePatientNumber | String | Usually Prefecture#Number |
| prefectureSourceURL | URL | Source data from prefectural government |
| sourceURL | URL | Any news or press release where this data was sourced from |
| notes | String | Other text |
| knownCluster | String | Known cluster this patient is from (can be multiple, separated by commas) |
| cruiseQuarantineOfficer | boolean | Identified as a cruise quarantine officer (counted separately by some departments) |
| cruisePassengerDisembarked | boolean | Patient was a cruise passenger, disembarked after testing negative |
| charterFlightPassenger | boolean | Returned from the Wuhan Charter Flight |


### docs/patient_data/summary.json

Individal Prefecture data:
``` json
[
    {
      "name": "Aichi",
      "summary": {
        "count": 155,
        "cruisePassenger": 0,
        "cruiseWorker": 0,
        "deaths": 12,
        "progression": [],
        "cityCounts": {
          "Nagoya": 108,
          "Owari": 11,
          "Gamagori, Mikawa": 4,
          "Mikawa": 1,
          "Okazaki": 3,
          "Ichinomiya": 3,
          "Toyota": 1,
          "Handa": 1,
          "Kiyosu": 1,
          "Taketoyo": 1,
          "Kasugai": 1,
          "Konan": 1,
          "Chita": 2,
          "Toyokawa": 1
        }
      }
    },
]    
```

List is sorted by summary.count.

| Field | Values | Description |
| ----- | ------ | ----------- |
| count | Numeric | Total infected count |
| cruisePassenger | Numeric | Total number of cruise passengers |
| cruiseWorker | Numeric | Total number of quarantine officers on cruise ship |
| deaths | Numeric | Total number of deaths |
| recovered | Numeric | Total number of recovered patients |
| critical | Numeric | Total number of patients in critical condition (respirators) |
| cityCounts | Object | Keys are individual cites and their total infected counts |

Daily summary data:
```
  {
      "confirmed": 16,
      "recoveredCumulative": 372,
      "deceasedCumulative": 53,
      "criticalCumulative": 56,
      "testedCumulative": 27005,
      "date": "2020-03-28",
      "confirmedCumulative": 1525
    }
```

| Field | Values | Description |
| ----- | ------ | ----------- |
| date | String | Date |
| confirmed | Numeric | Number of confirmed cases on that day |
| confirmedCumulative | Numeric | Total number of confirmed cases accumulated up to this day (including today) |
| recoveredCumulative | Numeric | Total number of recovered patients accumulated up to this day (including today) |
| criticalCumulative | Numeric | Total number of critical patients accumulated up to this day (including today) |
| deceasedCumulative | Numeric | Total number of deaths accumulated up to this day (including today) |
