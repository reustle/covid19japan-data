# Data repository for covid19japan.com

[data.covid19japan.com](https://data.covid19japan.com)

This repository contains the JSON export of the [Live Japan Patient Database (Google Spreadsheet)](https://docs.google.com/spreadsheets/d/e/2PACX-1vRri4r42DHwMHePjJfYN-qEWhGvKeOQullBtEzfle15i-xAsm9ZgV8oMxQNhPRO1CId39BPnn1IO5YO/pubhtml) that supports [covid19japan.com](https://covid19japan.com). You can find more details about contributing to the sheet [in this document](https://docs.google.com/document/d/1JbQn10KvmYYUHCPa7LObsUCG1m_tVY-S4BrchzRMzBI/edit).

 * [Data Formats](#data-formats)
 * [Data Sources](#data-sources)
 * [Development](#development)


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
| mhlwPatientNumber | Numeric | Identifier given by MHLW, obseleted by Prefecture number |
| prefecturePatientNumber | String | Usually Prefecture#Number |
| prefectureSourceURL | URL | Source data from prefectural government |
| sourceURL | URL | Any news or press release where this data was sourced from |
| notes | String | Other text |
| knownCluster | String | Known cluster this patient is from (can be multiple, separated by commas) |

### docs/patient_data/summary.json

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

Prefecture Summary:

List of 

``` json
[
    {
      "name": "Aichi",
      "summary": {
        "count": 155,
        "cruisePassenger": 0,
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
| deaths | Numeric | Total number of deaths |
| recovered | Numeric | Total number of recovered patients |
| critical | Numeric | Total number of patients in critical condition (respirators) |
| cityCounts | Object | Keys are individual cites and their total infected counts |

Day by day summary:

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


## Contributing Data

If you would like to update any missing or incorrect data on the graphs, please leave a comment on this spreadsheet, and/or request edit access.

https://docs.google.com/spreadsheets/d/e/2PACX-1vRri4r42DHwMHePjJfYN-qEWhGvKeOQullBtEzfle15i-xAsm9ZgV8oMxQNhPRO1CId39BPnn1IO5YO/pubhtml


## Data Sources

Data sources we're using. 

Our data is sourced from a variety of sources, primarily Japanese 
news outlets like NHK, prefectural governments and the Ministry of Health,
Labour and Welfare.

**Countrywide Sources**

The Ministry of Health, Labour and Welfare (MHLW) produces several sources of
data that we use to cross check and verify.

 * [MHLW COVID19 Information Page (新型コロナウイルス感染症について)](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000164708_00001.html)
 * [MHLW COVID19 Daily Press Releases](https://www.mhlw.go.jp/stf/houdou/index.html): The most important document is the Patient Detail Updates (新型コロナウイルスに関連した患者の発生について) that list patient information linking to prefectural government reports.
   * [4/2020](https://www.mhlw.go.jp/stf/houdou/houdou_list_202004.html) 
   * [3/2020](https://www.mhlw.go.jp/stf/houdou/houdou_list_202003.html) 
   * [2/2020](https://www.mhlw.go.jp/stf/houdou/houdou_list_202002.html). 
 * [MHLW COVID19 Daily Summaries](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000121431_00086.html) including aggregate counts and per-prefecture information.

 NHK News is the most comprehensive and standardized reporting of infection cases per prefecture as well as a daily sum up every evening.
 
  * Example: [Daily Report (新型コロナウイルス 国内感染者)](https://www3.nhk.or.jp/news/html/20200323/k10012344821000.html?utm_int=news_contents_news-main_001)
  * [COVID News Page](https://www3.nhk.or.jp/news/special/coronavirus/latest-news/)


**Prefecture-specific Data**

|Prefecture/City    | Patients Source    | Dashboard | Notes |
|--------|----------|----------|------|
|Aichi    | [新型コロナウイルス感染症患者の発生について](https://www.pref.aichi.jp/site/covid19-aichi/corona-kisya.html)  | [Daily Aggregate](https://www.pref.aichi.jp/site/covid19-aichi/kansensya-kensa.html)|
|Aichi - Nagoya   |[新型コロナウイルス感染症患者の発生について](http://www.city.nagoya.jp/kenkofukushi/page/0000126920.html)|  [Weekly Summary](http://www.city.nagoya.jp/kenkofukushi/page/0000101900.html)| Patients here are not listed on Aichi Prefecture Site |
| Aichi - Toyota | [発生状況](https://www.city.toyota.aichi.jp/kurashi/kenkou/eisei/1036258.html) | | Patients here are not listed on Aichi Prefecture Site |
| Aichi - Toyohashi | [患者の概要](https://www.city.toyohashi.lg.jp/41805.htm) | | Patients listed here are not listed in Aichi Prefecture Site |
|Akita    |[新型コロナウイルス感染症について](https://www.pref.akita.lg.jp/pages/archive/47957)||
|Aomori    |[新型コロナウイルス感染症について](http://www.pref.aomori.lg.jp/welfare/health/wuhan-novel-coronavirus2020.html)||
|Chiba    |[患者の発生について｜新型コロナウイルス感染症](https://www.pref.chiba.lg.jp/shippei/press/2019/ncov-index.html)| Data is two days behind |
|Ehime    | [ 感染者の発生状況等について](https://www.pref.ehime.jp/h25500/kansen/covid19.html)||
|Fukui    |[新型コロナウイルス感染症について](https://www.pref.fukui.lg.jp/doc/kenkou/kansensyo-yobousessyu/corona.html)||
|Fukuoka    | [福岡県内での発生状況](https://www.pref.fukuoka.lg.jp/contents/covid19-hassei.html)| [Dashboard](https://fukuoka.stopcovid19.jp/)|
|Fukushima    |[福島県内の新型コロナウイルス発生状況](https://www.pref.fukushima.lg.jp/sec/21045c/fukushima-hasseijyoukyou.html)||
|Gifu    | [新型コロナウイルス感染症の患者の発生について](https://www.pref.gifu.lg.jp/kinkyu-juyo-joho/shingata_corona_kansendoko.html)|
|Gunma    |[新型コロナウイルス感染症について](https://www.pref.gunma.jp/07/z87g_00016.html)||
| Gunma - Takasaki | [新型コロナウイルス感染症患者の発生について](https://www.city.takasaki.gunma.jp/docs/2020032400102/) |||
|Hiroshima    | [患者の発生について](https://www.pref.hiroshima.lg.jp/soshiki/57/bukan-coronavirus.html)||
|Hokkaido    |[新型コロナウイルス感染症の道内の発生状況](http://www.pref.hokkaido.lg.jp/hf/kth/kak/hasseijoukyou.htm)||
|Hokkaido - Sapporo  |[新型コロナウイルス感染症の道内の発生状況](https://www.city.sapporo.jp/hokenjo/f1kansen/2019n-covhassei.html)||
|Hyogo    | [新型コロナウイルスに感染した患者の発生状況](https://web.pref.hyogo.lg.jp/kk03/corona_hasseijyokyo.html) [PCR](https://web.pref.hyogo.lg.jp/kf16/singatakoronakensa.html) ||
|Hyogo - Himeji | [新型コロナウイルス感染症患者の発生について](https://www.city.himeji.lg.jp/emergencyinfo/0000000179.html)||
|Hyogo - Nishinomiya 西宮市 | [新型コロナウイルス感染症患者の市内発生状況](https://www.nishi.or.jp/kurashi/anshin/infomation/k_00022020111.html) ||
|Ibaraki    | [新型コロナウイルス感染症患者の県内の発生状況について](https://www.pref.ibaraki.jp/1saigai/2019-ncov/hassei.html) ||  |
|Ishikawa    | [新型コロナウイルス感染症の県内の患者発生状況](https://www.pref.ishikawa.lg.jp/kansen/coronakennai.html) || Updates daily (HTML) |
|Iwate    |[新型コロナウイルス感染症関連情報](https://www.pref.iwate.jp/kurashikankyou/iryou/covid19/index.html)||
|Kagawa    | [新型コロナウイルスに関連した患者の発生について](https://www.pref.kagawa.lg.jp/content/dir1/dir1_6/dir1_6_1/index.shtml)||
|Kanagawa    | [新型コロナウイルスに感染した患者の発生状況](https://www.pref.kanagawa.jp/docs/ga4/bukanshi/occurrence.html) | [Dashboard](https://www.pref.kanagawa.jp/osirase/1369/?fbclid=IwAR2-8RAnRsixEpUFpaE-qLflTrAA-DbPaLa9r9SzOobgtGriI-ufROesEKA)| Slow to update |
|Kanagawa - Funabashi   |[市内で新型コロナウイルス感染症患者](https://www.city.funabashi.lg.jp/kenkou/kansenshou/001/index.html)||
|Kanagawa - Kawasaki | [川崎市内の新型コロナウイルスに感染した患者の発生状況](http://www.city.kawasaki.jp/350/page/0000115886.html) |||
|Kanagawa - Sagamihara | [発生状況等](https://www.city.sagamihara.kanagawa.jp/shisei/koho/1019191.html) || Frequently updated |
| Kanagawa - Yokohama| [横浜市内の新型コロナウイルスに感染した患者の発生状況](https://www.city.yokohama.lg.jp/kurashi/kenko-iryo/yobosesshu/kansensho/coronavirus/kanja.html) || Updated daily|
|Kanagawa - Yokosuka   |[横須賀市内の新型コロナウイルス感染症患者の発生状況](https://www.city.yokosuka.kanagawa.jp/3130/hasseijoukyou.html)|| Updated more frequently than Kanagawa |
|Kagoshima    |[新型コロナウイルス感染症に関する情報](https://www.pref.kagoshima.jp/ae06/kenko-fukushi/kenko-iryo/kansen/kansensho/coronavirus.html)||
|Kochi    | [高知県における新型コロナウイルス感染症患者の発生状況について](https://www.pref.kochi.lg.jp/soshiki/130401/2020022900049.html) [PCR](https://www.pref.kochi.lg.jp/soshiki/130120/2020030400166.html)|| Updated daily |
|Kumamoto    | [新型コロナウイルス感染症](https://www.pref.kumamoto.jp/kiji_30386.html) || Does not number their patients |
|Kumamoto - Kumamoto City   | [新型コロナウイルス感染症について](http://www.city.kumamoto.jp/hpkiji/pub/detail.aspx?c_id=5&id=26562) ||
|Kyoto    |[新型コロナウイルス感染症の患者の発生について](https://www.pref.kyoto.jp/kentai/news/novelcoronavirus.html#F)|
|Mie    |[新型コロナウイルス感染症に関連した肺炎患者の発生について](https://www.pref.mie.lg.jp/YAKUMUS/HP/m0068000066.htm)||
|Miyagi    | [県内における発生状況等について](https://www.pref.miyagi.jp/site/covid-19/02.html)|| Updated daily |
|Miyazaki    |[新型コロナウイルス感染症患者](https://www.pref.miyazaki.lg.jp/kenko/hoken/kansensho/covid19/hassei.html)||
|Nagano    | [新型コロナウイルス感染症に係る検査状況について](https://www.pref.nagano.lg.jp/koho/koho/pressreleases/2004happyoshiryo.html)| [Dashboard](https://www.pref.nagano.lg.jp/hoken-shippei/kenko/kenko/kansensho/joho/bukan-haien-doko.html) | Very little data, check MHLW |
|Nara    |[新型コロナウイルス感染症の患者の発生について](http://www.pref.nara.jp/module/1356.htm#moduleid1356) || Inconsistent recording of asymptomatic vs symptomatic. Numbering system changed after patient #7 |
|Nagasaki    | [長崎県内の発生状況](https://www.pref.nagasaki.jp/bunrui/hukushi-hoken/kansensho/corona_nagasaki/corona_nagasaki_shousai/#hassei)| Updated frequently |
|Niigata    | [県内における感染者の発生について](https://www.pref.niigata.lg.jp/sec/kikitaisaku/shingata-corona.html#hasseijoukyou)||
|Oita    |[大分県内における患者発生について](http://www.pref.oita.jp/site/covid19-oita/covid19-pcr.html)||
|Oita - Oita City | [大分市における新たな新型コロナウイルス感染症患者の発生について](https://www.city.oita.oita.jp/kenko/iryo/kansensho/index.html) ||
|Okayama    |[新型コロナウイルス感染症について](https://www.pref.okayama.jp/page/645925.html)||
|Okinawa    | [Patients](https://www.pref.okinawa.lg.jp/site/hoken/chiikihoken/kekkaku/press/20200214_covid19_pr1.html)|[患者の発生について](https://www.pref.okinawa.jp/site/hoken/chiikihoken/kekkaku/2019-ncov.html)| Up to date |
|Osaka    | [新型コロナウイルス感染症について](http://www.pref.osaka.lg.jp/iryo/osakakansensho/corona.html)|| Usually few days behind. Use MHLW for most up-to-date reports. |
|Saga    | [佐賀県の新型コロナウイルス感染症の状況](https://www.pref.saga.lg.jp/kiji00373220/index.html) ||
|Saitama    |[記者発表資料](https://www.pref.saitama.lg.jp/a0701/covid19/jokyo.html) |[Dashboard](https://saitama.stopcovid19.jp/)|
|Shiga    | [新型コロナウイルス感染症患者の発生状況](https://www.pref.shiga.lg.jp/ippan/kenkouiryouhukushi/yakuzi/310735.html)||
|Shimane    |[新型コロナウイルス感染症に関する情報](https://www.pref.shimane.lg.jp/bousai_info/bousai/kikikanri/shingata_taisaku/new_coronavirus_portal.html)||
|Shizuoka    |[新型コロナウイルス感染症(COVID-19)関連情報](https://www.pref.shizuoka.jp/kinkyu/covid-19.html)||
| Shizuoka - Shizuoka City | [新型コロナウイルス感染症](https://www.city.shizuoka.lg.jp/388_000101.html)||
| Tochigi    | [新型コロナウイルス感染症について](http://www.pref.tochigi.lg.jp/e04/welfare/hoken-eisei/kansen/hp/coronakensahasseijyoukyou.html) ||
| Tochigi - Utsunomiya City | [宇都宮市における新型コロナウイルス感染症の発生状況](https://www.city.utsunomiya.tochigi.jp/kurashi/kenko/kansensho/etc/1023128.html)||
|Tokushima    | [新型コロナウイルス感染症について](https://www.pref.tokushima.lg.jp/ippannokata/kenko/kansensho/5034012#25)||
|Tokyo    | [東京都新型コロナウイルス感染症対策本部報](https://www.bousai.metro.tokyo.lg.jp/taisaku/saigai/1007261/index.html)| [Dashboard](https://stopcovid19.metro.tokyo.lg.jp/en)|
|Tottori    |[新型コロナウイルス感染症(COVID-19)特設サイト](https://www.pref.tottori.lg.jp/corona-virus/)||
|Toyama    |[新型コロナウイルス感染症の県内の患者等発生状況](http://www.pref.toyama.jp/cms_sec/1205/kj00021798.html)||
|Wakayama    |[新型コロナウイルス感染症に関連する情報について](https://www.pref.wakayama.lg.jp/prefg/041200/d00203387.html)||
|Yamagata    |[新型コロナウイルス感染症に関連するポータルサイト](http://www.pref.yamagata.jp/ou/bosai/020072/kochibou/coronavirus/coronavirus.html)||
| Yamagata - Yonezawa | [新型コロナウイルス感染症に係る市からのお知らせ](http://www.city.yonezawa.yamagata.jp/item/8355.html#itemid8355) |||
|Yamaguchi    |[新型コロナウイルス感染症の山口県内での発生について](https://www.pref.yamaguchi.lg.jp/cms/a15200/kansensyou/koronahassei.html)||
|Yamanashi    |[新型コロナウイルス感染症の県内における発生状況](https://www.pref.yamanashi.jp/koucho/coronavirus/info_coronavirus_prevention.html)||

**We need your help!** Please submit any information sources via the "Issues" tab above. Thank you! ありがとう！


# Development

To build the data ingestion and publishing tool:

```
npm install
```

To run the data generation:

```
node generate.js
```

This will output the data into docs/ 

To make the data ready for publishing (which really just changes the symlink latest.json):

```
node publish.js
```

# Publish Cycle

Every 15 minutes a Github Workflow runs `.github/workflows/update.yml` to fetch the latest
data from the spreadsheet, runs a set of post processing on it and checks in the generated
JSON file in to the docs/ directory.

If it detects some data inconsistencies, it will abort and not check in any data. The data
verification checks are in `src/verify.js`



