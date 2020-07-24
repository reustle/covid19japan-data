# Data Formats

The patient database, data summaries and Tokyo summary is served from the following URLs:

 * `https://data.covid19japan.com/patient_data/latest.json` : Full merged list of patient data for all of Japan.
 * `https://data.covid19japan.com/summary/latest.json` : Daily summary and Per-prefecture summary.
 * `https://data.covid19japan.com/tokyo/counts.json`: Tokyo per-ward/city summary.

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
    "patientId": "64",
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
| patientId | String | Unique identifier for patients (if this value is -1, this means it may be a duplicate row (see: ``confirmedPatient``) [Updated: This changed from a number to a string (4/6)] Example Values: 123 or TOK123 or -1 |
| confirmedPatient | boolean | Patient is a confirmed patient. If false, this could be a duplicate patient which we cannot identify. If this is false, do not count this patient in confirmed cases count. But it exists so that we can also tally deaths of existing patients. |
| dateAnnounced | YYYY-MM-DD | Date patient was announced to have tested positive |
| ageBracket | Numeric | Age bracket (40 mean 40-49). -1 for unspecified |
| gender | M/F/Unspecified | |
| residence | String | City/Town, Prefecture (not consistent) |
| detectedCityTown | City/Town or Blank | City/Town patient was detected in |
| detectedPrefecture | Prefecture Name, or "Unspecified" or "Port of Entry" | Prefecture patient was detected in. |
| patientStatus | Unspecified, Hospitalized, Deceased, Discharged, Recovered | Condition of patient (Discharged and Recovered are similar) |
| mhlwPatientNumber | Numeric | Identifier given by MHLW, obsoleted by Prefecture number |
| prefecturePatientNumber | String | Usually Prefecture#Number |
| prefectureSourceURL | URL | Source data from prefectural government |
| sourceURL | URL | Any news or press release where this data was sourced from |
| notes | String | Other text |
| knownCluster | String | Known cluster this patient is from (can be multiple, separated by commas) |

### docs/summary/latest.json

Top level objects: 

```json
 {
   "prefectures": [ ... ],
   "daily": [ ... ],
   "lastUpdated": "2020-04-05T10:32:24+09:00"
 }
```
| Field | Values | Description |
| ----- | ------ | ----------- |
| prefectures | List of Dict |  Each item is a prefectural summary |
| daily | List of Dict | Each dict represents the summary of the single day |
| lastUpdated| ISO timestamp | Time stamp (in JST) of when the data was updated. |

#### Prefecture Summary:

List of per-prefecture summaries. This list includes both actual prefectures and pseudo-prefectures
such as "Unspecified", "Port of Entry", "Diamond Princess Cruise Ship" and "Nagasaki Cruise Ship". 

Those pseudo-prefectures will have the flag "pseudoPrefecture" set to true if you need to filter them out.

``` json
[
   {
      "confirmed": 3840,
      "deceased": 89,
      "recovered": 59,
      "confirmedByCity": {
        "Tokyo": 62,
        "Suginami": 1,
        "Adachi": 3,
        "Nerima": 1
      },
      "dailyConfirmedCount": [ ... 123, 132, 134, 161, 103],
      "dailyConfirmedStartDate": "2020-01-08",
      "newlyConfirmed": 0,
      "yesterdayConfirmed": 103,
      "dailyDeathCount": [0, 0, ... ],
      "dailyDeathsStartDate": "2020-01-08",
      "newlyDeceased": 0,
      "yesterdayDeceased": 0,
      "name_ja": "東京都",
      "name": "Tokyo"
    },
]    
```

List is sorted by `confirmed`

| Field | Values | Description |
| ----- | ------ | ----------- |
| name | String | English name of prefecture |
| name_ja | String | Japanese name of prefecture |
| pseudoPrefecture | boolean | True if this is not a real prefecture but a grouping of patients (e.g. Diamond Princess Cruise Ship) |
| confirmed | Numeric | Total infected count |
| deceased | Numeric | Total number of deaths |
| recovered | Numeric | Total number of recovered patients |
| confirmedByCity | Object | Keys are individual cites and their total infected counts |
| dailyConfirmedCount | Array of Int | Daily confirmed for each day from dailyConfirmedStartDate |
| dailyConfirmedStartDate | String | YYYY-MM-DD string that represents the day the dailyConfirmedCount's first entry was recorded on |
| newlyConfirmed | Numeric | Number of confirmed cases for today |
| yesterdayConfirmed | Numeric | Number of confirmed cases for yesterday |
| dailyDeathCount | Array of Int | Daily deaths for each day from dailyConfirmedStartDate |
| dailyDeathStartDate | String | YYYY-MM-DD string that represents the day the dailyDeathCount's first entry was recorded on |
| newlyDeceased | Numeric | Number of deaths for today |
| yesterdayDeceased | Numeric | Number of deaths cases for yesterday |



Day by day summary:

```
   {
      "confirmed": 367,
      "deceased": 16,
      "confirmedCumulative": 12769,
      "recoveredCumulative": 1530,
      "deceasedCumulative": 315,
      "criticalCumulative": 263,
      "testedCumulative": 141600,
      "cruiseConfirmedCumulative": 803,
      "cruiseDeceasedCumulative": 13,
      "cruiseRecoveredCumulative": 645,
      "cruiseTestedCumulative": 4559,
      "cruiseCriticalCumulative": 5,
      "date": "2020-04-24",
      "confirmedAvg3d": 402,
      "confirmedCumulativeAvg3d": 12352,
      "confirmedAvg7d": 411,
      "confirmedCumulativeAvg7d": 11560,
      "deaths": 16
    },
```

| Field | Values | Description |
| ----- | ------ | ----------- |
| date | String | Date |
| confirmed | Numeric | Number of confirmed cases on that day |
| deceased | Numeric | Number of deaths on that day (replaces deprecated field: deaths) |
| confirmedCumulative | Numeric | Total number of confirmed cases accumulated up and including this day (excluding Cruise Ships - see cruiseConfirmedCumulative)) |
| recoveredCumulative | Numeric | Total number of recovered patients accumulated up and including this day (excluding Cruise Ships - see cruiseRecoveredCumulative) |
| criticalCumulative | Numeric | Total number of critical patients accumulated up and including this day (excluding Cruise Ships - see cruiseDeceasedCumulative) |
| deceasedCumulative | Numeric | Total number of deaths accumulated up and including this day (excluding Cruise Ships - see cruiseDeceasedCumulative) |
| testedCumulative | Numeric | Total number of tested accumulated up and including this day (excluding Cruise Ships - see cruiseTestedCumulative) |
| cruiseConfirmedCumulative | Numeric | Total number of confirmed cases onboard the Diamond Princess and Nagasaki Cruise Ships accumulated up and including this day. (Does not include disembarked passengers who later tested positive) |
| cruiseDeceasedCumulative | Numeric | Total number of recovered patients onboard the Diamond Princess and Nagasaki Cruise Ships accumulated up and including this day. (Does not include disembarked passengers who later tested positive) |
| cruiseCriticalCumulative | Numeric | Total number of critical patients onboard the Diamond Princess and Nagasaki Cruise Ships accumulated up and including this day. (Does not include disembarked passengers who later tested positive) |
| cruiseRecoveredCumulative | Numeric | Total number of recoveries onboard the Diamond Princess and Nagasaki Cruise Ships accumulated up and including this day. (Does not include disembarked passengers who later tested positive) |
| cruiseTestedCumulative | Numeric | Total number of tests onboard the Diamond Princess and Nagasaki Cruise Ships accumulated up and including this day. (Does not include disembarked passengers who later tested positive) |
| confirmedAvg3d | Numeric | Rolling 3-day average of confirmed |
| confirmedCumlativeAvg3d | Numeric | Rolling 3-day average of confirmedCumulative |
| confirmedAvg7d | Numeric | Rolling 7-day average of confirmed |
| confirmedCumlativeAvg7d | Numeric | Rolling 7-day average of confirmedCumulative |

All the counts, except for the `cruise*Cumulative` fields do not include any cruise ship workers and passengers. 

### docs/tokyo/counts.json

```
[
  {
    "name": "Chiyoda",
    "name_ja": "千代田",
    "values": [
      {
        "date": "2020-03-31",
        "count": 3
      },
      ...
]      
```      

