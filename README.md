# Data repository for covid19japan.com

[data.covid19japan.com](https://data.covid19japan.com)

This repository contains the JSON export of the [Live Japan Patient Database (Google Spreadsheet)](https://docs.google.com/spreadsheets/d/1jfB4muWkzKTR0daklmf8D5F0Uf_IYAgcx_-Ij9McClQ/edit#gid=0) that supports [covid19japan.com](https://covid19japan.com).

## Data Formats

### docs/patient_data/latest.json

Example Patient Data:
```
  {
    "patientId": 320,
    "dateAnnounced": "2020-03-04",
    "ageBracket": 50,
    "gender": "M",
    "detectedPrefecture": "Osaka",
    "patientStatus": "Hospitalized",
    "notes": "Dinner with Arc attendee",
    "knownCluster": "Osaka Live House Soap Opera Classics Umeda, Osaka Americamura FANJ Twice",
    "mhlwPatientNumber": "285",
    "prefecturePatientNumber": "Osaka#15",
    "prefectureSourceURL": "http://www.pref.osaka.lg.jp/hodo/attach/hodo-37633_5.pdf",
    "sourceURL": "https://www3.nhk.or.jp/news/html/20200304/k10012313981000.html?utm_int=news_contents_news-main_003"
  },
```

### docs/patient_data/summary.json

Individal Prefecture data:
```
[
      "Aichi",
      {
        "count": 150,
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
    ],
```
