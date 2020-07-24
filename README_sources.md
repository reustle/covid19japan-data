# Japan COVID-19 Data Sources

The data is sourced manually by hand and by semi-automated tools, coming primarily from:

 * Prefectural and City governments,
 * Ministry of Health Labour and Welfare,
 * NHK News (Japanese)

## Ministry of Health (MHLW)

The Ministry of Health, Labour and Welfare (MHLW) produces several sources of
data that we use to cross check and verify.

 * [MHLW COVID19 Information Page (新型コロナウイルス感染症について)](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000164708_00001.html)
 * [MHLW COVID19 Daily Press Releases](https://www.mhlw.go.jp/stf/houdou/index.html): The most important document is the Patient Detail Updates (新型コロナウイルスに関連した患者の発生について) that list patient information linking to prefectural government reports.
   * [4/2020](https://www.mhlw.go.jp/stf/houdou/houdou_list_202004.html) 
   * [3/2020](https://www.mhlw.go.jp/stf/houdou/houdou_list_202003.html) 
   * [2/2020](https://www.mhlw.go.jp/stf/houdou/houdou_list_202002.html). 
 * [MHLW COVID19 Daily Summaries](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000121431_00086.html) including aggregate counts and per-prefecture information.

## NHK News

 NHK News is the most comprehensive and standardized reporting of infection cases per prefecture as well as a daily sum up every evening.
 
  * Example: [Daily Report (新型コロナウイルス 国内感染者)](https://www3.nhk.or.jp/news/special/coronavirus/data-all/)
  * [COVID News Page](https://www3.nhk.or.jp/news/special/coronavirus/latest-news/)

## Prefectural, City Sources

For the most comprehensive and up-to-date list of sources, use our data source statusboard at [data.covid19japan.com/statusboard](https://data.covid19japan.com/statusboard).

For the machine readable list of data sources, see [src/sources.js](src/sources.js)


**Prefecture-specific Data**

|Prefecture/City    | Patients Source    | Dashboard | Notes |
|--------|----------|----------|------|
|Aichi    | [新型コロナウイルス感染症患者の発生について](https://www.pref.aichi.jp/site/covid19-aichi/corona-kisya.html)  | [Daily Aggregate](https://www.pref.aichi.jp/site/covid19-aichi/kansensya-kensa.html)|
|Aichi - Nagoya   |[新型コロナウイルス感染症患者の発生について](http://www.city.nagoya.jp/kenkofukushi/page/0000126920.html)|  [Weekly Summary](http://www.city.nagoya.jp/kenkofukushi/page/0000101900.html)| Patients here are not listed on Aichi Prefecture Site |
| Aichi - Toyota | [発生状況](https://www.city.toyota.aichi.jp/kurashi/kenkou/eisei/1036258.html) | | Patients here are not listed on Aichi Prefecture Site |
| Aichi - Toyohashi | [患者の概要](https://www.city.toyohashi.lg.jp/41805.htm) | | Patients listed here are not listed in Aichi Prefecture Site |
| Aichi - Okasaki | [新型コロナウイルス感染症患者の発生について](https://www.city.okazaki.lg.jp/1550/1562/1615/p025980.html) || Patients listed here are not on Aichi Prefecture site |
|Akita    |[新型コロナウイルス感染症について](https://www.pref.akita.lg.jp/pages/archive/47957)||
|Aomori    |[新型コロナウイルス感染症について](http://www.pref.aomori.lg.jp/welfare/health/wuhan-novel-coronavirus2020.html)||
|Chiba    |[患者の発生について｜新型コロナウイルス感染症](https://www.pref.chiba.lg.jp/shippei/press/2019/ncov-index.html)| Data is two days behind |
| Chiba - Chiba City | [市民の感染症患者の発生状況](https://www.city.chiba.jp/hokenfukushi/iryoeisei/seisaku/covid-19/kanjamatome.html) ||
|Chiba - Funabashi   |[市内で新型コロナウイルス感染症患者](https://www.city.funabashi.lg.jp/kenkou/kansenshou/001/index.html)||
| Chiba - Kashiwa | [Press Releases](http://www.city.kashiwa.lg.jp/policy_pr/pressrelease/r2houdou/index.html) ||
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
|Hyogo    | [新型コロナウイルスに感染した患者の発生状況](https://web.pref.hyogo.lg.jp/kk03/corona_hasseijyokyo.html) [PCR](https://web.pref.hyogo.lg.jp/kf16/singatakoronakensa.html) [Press Releases](https://web.pref.hyogo.lg.jp/kk03/singatakoronataiou.html)||
|Hyogo - Himeji | [新型コロナウイルス感染症患者の発生について](https://www.city.himeji.lg.jp/emergencyinfo/0000000179.html)||
|Hyogo - Nishinomiya 西宮市 | [新型コロナウイルス感染症患者の市内発生状況](https://www.nishi.or.jp/kurashi/anshin/infomation/k_00022020111.html) ||
|Ibaraki    | [新型コロナウイルス感染症患者の県内の発生状況について](https://www.pref.ibaraki.jp/1saigai/2019-ncov/hassei.html) ||  |
|Ishikawa    | [新型コロナウイルス感染症の県内の患者発生状況](https://www.pref.ishikawa.lg.jp/kansen/coronakennai.html) || Updates daily (HTML) |
|Iwate    |[新型コロナウイルス感染症関連情報](https://www.pref.iwate.jp/kurashikankyou/iryou/covid19/index.html)||
|Kagawa    | [新型コロナウイルスに関連した患者の発生について](https://www.pref.kagawa.lg.jp/content/dir1/dir1_6/dir1_6_1/index.shtml)||
|Kanagawa    | [新型コロナウイルスに感染した患者の発生状況](https://www.pref.kanagawa.jp/docs/ga4/bukanshi/occurrence.html) | [Dashboard](https://www.pref.kanagawa.jp/osirase/1369/?fbclid=IwAR2-8RAnRsixEpUFpaE-qLflTrAA-DbPaLa9r9SzOobgtGriI-ufROesEKA)| Slow to update |
| Kanagawa - Chigasaki | [茅ヶ崎市保健所管内での発生状況](https://www.city.chigasaki.kanagawa.jp/kenko/1022933/1038284.html) ||
| Kanagawa - Fujisawa | [藤沢市内の新型コロナウイルスに感染した患者の発生状況](https://www.city.fujisawa.kanagawa.jp/hokenyobo/kansensho/korona.html) ||
|Kanagawa - Kawasaki | [川崎市内の新型コロナウイルスに感染した患者の発生状況](http://www.city.kawasaki.jp/350/page/0000115886.html) |||
|Kanagawa - Sagamihara | [発生状況等](https://www.city.sagamihara.kanagawa.jp/shisei/koho/1019191.html) || Frequently updated |
| Kanagawa - Yokohama| [横浜市内の新型コロナウイルスに感染した患者の発生状況](https://www.city.yokohama.lg.jp/kurashi/kenko-iryo/yobosesshu/kansensho/coronavirus/kanja.html) || Updated daily|
|Kanagawa - Yokosuka   |[横須賀市内の新型コロナウイルス感染症患者の発生状況](https://www.city.yokosuka.kanagawa.jp/3130/hasseijoukyou.html)|| Updated more frequently than Kanagawa |
|Kagoshima    |[新型コロナウイルス感染症に関する情報](https://www.pref.kagoshima.jp/ae06/kenko-fukushi/kenko-iryo/kansen/kansensho/coronavirus.html)||
|Kochi    | [高知県における新型コロナウイルス感染症患者の発生状況について](https://www.pref.kochi.lg.jp/soshiki/130401/2020022900049.html) [PCR](https://www.pref.kochi.lg.jp/soshiki/130120/2020030400166.html)|| Updated daily |
|Kumamoto    | [新型コロナウイルス感染症](https://www.pref.kumamoto.jp/kiji_32300.html) |  | Patients numbers in the Summary |
|Kumamoto - Kumamoto City   | [新型コロナウイルス感染症について](https://www.city.kumamoto.jp/corona/hpKiji/pub/detail.aspx?c_id=5&id=27681&class_set_id=22&class_id=3261) ||
|Kyoto    |[新型コロナウイルス感染症の患者の発生について](https://www.pref.kyoto.jp/kentai/news/novelcoronavirus.html#F)|
| Kyoto - Kyoto City | [Homepage](https://www.city.kyoto.lg.jp/) [Patients](https://www.city.kyoto.lg.jp/hokenfukushi/page/0000266641.html) || Homepage has more up to date PRs, but Patients link has all patients |
| Kyoto - Muko | [市内の新型コロナウイルス感染状況について](https://www.city.muko.kyoto.jp/kurashi/kinkyu/1585565517890.html) ||
|Mie    |[新型コロナウイルス感染症に関連した肺炎患者の発生について](https://www.pref.mie.lg.jp/YAKUMUS/HP/m0068000066.htm)||
|Miyagi    | [県内における発生状況等について](https://www.pref.miyagi.jp/site/covid-19/02.html)|| Updated daily |
|Miyagi - Sendai | [仙台市内の感染者の発生状況](https://www.city.sendai.jp/kikikanri/kinkyu/200131corona2.html) ||
|Miyazaki    |[新型コロナウイルス感染症患者](https://www.pref.miyazaki.lg.jp/kenko/hoken/kansensho/covid19/hassei.html)||
|Nagano    | [新型コロナウイルス感染症に係る検査状況について](https://www.pref.nagano.lg.jp/koho/koho/pressreleases/2004happyoshiryo.html)|  | Very little data, check MHLW |
|Nagano - Nagano City | [新型コロナウイルス感染症患者の発生について](https://www.city.nagano.nagano.jp/site/covid19-joho/449132.html) ||
|Nara    |[新型コロナウイルス感染症の患者の発生について](http://www.pref.nara.jp/module/1356.htm#moduleid1356) || Inconsistent recording of asymptomatic vs symptomatic. Numbering system changed after patient #7 |
|Nagasaki    | [長崎県内の発生状況](https://www.pref.nagasaki.jp/bunrui/hukushi-hoken/kansensho/corona_nagasaki/corona_nagasaki_shousai/)|| Updated frequently |
|Niigata    | [県内における感染者の発生について](https://www.pref.niigata.lg.jp/sec/kikitaisaku/hasseijokyo-covid19-niigataken.html)||
| Niigata - Niigata City | [報道資料、会議資料](https://www.city.niigata.lg.jp/iryo/kenko/yobou_kansen/kansen/coronavirus.html) ||
|Oita    |[大分県内における患者発生について](http://www.pref.oita.jp/site/covid19-oita/covid19-pcr.html)||
|Oita - Oita City | [大分市における新たな新型コロナウイルス感染症患者の発生について](https://www.city.oita.oita.jp/kenko/iryo/kansensho/index.html) ||
|Okayama    |[新型コロナウイルス感染症について](https://www.pref.okayama.jp/page/645925.html)||
|Okinawa    | [Patients](https://www.pref.okinawa.jp/site/hoken/chiikihoken/kekkaku/covid19_hasseijoukyou.html)|[患者の発生について](https://www.pref.okinawa.jp/site/hoken/chiikihoken/kekkaku/2019-ncov.html)| Up to date |
|Osaka    | [新型コロナウイルス感染症について](http://www.pref.osaka.lg.jp/hodo/index.php?HST_TITLE1=%83R%83%8D%83i&SEARCH_NUM=10&searchFlg=%8C%9F%81@%8D%F5&site=fumin)|| Usually few days behind. Use MHLW for most up-to-date reports. |
|Saga    | [佐賀県の新型コロナウイルス感染症の状況](https://www.pref.saga.lg.jp/kiji00373220/index.html) ||
|Saitama    |[記者発表資料](https://www.pref.saitama.lg.jp/a0701/covid19/jokyo.html) -- [新型コロナウイルスに関連した患者の死亡について](https://www.pref.saitama.lg.jp/kense/shiryo/nyu-su/2020/5gatsu/index.html)|[Dashboard](https://saitama.stopcovid19.jp/)|
| Saitama - Saitama City | [本市の発生状況について](https://www.city.saitama.jp/002/001/008/006/013/001/p070442.html) ||
| Saitama - Koshigaya | [新型コロナウイルス感染症の越谷市内の発生状況](https://www.city.koshigaya.saitama.jp/kurashi_shisei/fukushi/hokenjo/kansensho/koshigaya_contents0310.html) || 
| Saitama - Kawaguchi | [新型コロナウイルス感染症について](https://www.city.kawaguchi.lg.jp/soshiki/01090/018/30169.html) | [Dashboard](https://www.kawaguchi-stopcovid19.jp/) |
|Shiga    | [新型コロナウイルス感染症患者の発生状況](https://www.pref.shiga.lg.jp/ippan/kenkouiryouhukushi/yakuzi/310735.html)||
|Shimane    |[新型コロナウイルス感染症に関する情報](https://www.pref.shimane.lg.jp/bousai_info/bousai/kikikanri/shingata_taisaku/new_coronavirus_portal.html)||
|Shizuoka    |[新型コロナウイルス感染症(COVID-19)関連情報](https://www.pref.shizuoka.jp/kinkyu/covid-19.html)||
| Shizuoka - Shizuoka City | [新型コロナウイルス感染症](https://www.city.shizuoka.lg.jp/388_000101.html)||
| Tochigi    | [新型コロナウイルス感染症について](http://www.pref.tochigi.lg.jp/e04/welfare/hoken-eisei/kansen/hp/coronakensahasseijyoukyou.html) ||
| Tochigi - Utsunomiya City | [宇都宮市における新型コロナウイルス感染症の発生状況](https://www.city.utsunomiya.tochigi.jp/kurashi/kenko/kansensho/etc/1023128.html)||
|Tokushima    | [新型コロナウイルス感染症について](https://www.pref.tokushima.lg.jp/ippannokata/kenko/kansensho/5034012#25)||
|Tokyo    | [東京都新型コロナウイルス感染症対策本部報](https://www.bousai.metro.tokyo.lg.jp/taisaku/saigai/1007261/index.html),  [最新の報道発表](https://www.fukushihoken.metro.tokyo.lg.jp/hodo/index.html)| [Dashboard](https://stopcovid19.metro.tokyo.lg.jp/en) [covid19tokyo.live](https://covid19tokyo.live/)|
|Tottori    |[新型コロナウイルス感染症(COVID-19)特設サイト](https://www.pref.tottori.lg.jp/corona-virus/)||
|Toyama    |[新型コロナウイルス感染症の県内の患者等発生状況](http://www.pref.toyama.jp/cms_sec/1205/kj00021798.html)||
| Toyama - Toyama City | [本市での感染者の発生状況について](https://www.city.toyama.toyama.jp/fukushihokenbu/hokensho/hokenyoboka/shingatakorona_3.html) |||
|Wakayama    |[新型コロナウイルス感染症に関連する情報について](https://www.pref.wakayama.lg.jp/prefg/041200/d00203387.html)||
|Yamagata    |[新型コロナウイルス感染症に関連するポータルサイト](http://www.pref.yamagata.jp/ou/bosai/020072/kochibou/coronavirus/coronavirus.html)||
| Yamagata - Yonezawa | [新型コロナウイルス感染症に係る市からのお知らせ](http://www.city.yonezawa.yamagata.jp/item/8355.html#itemid8355) |||
|Yamaguchi    |[新型コロナウイルス感染症の山口県内での発生について](https://www.pref.yamaguchi.lg.jp/cms/a15200/kansensyou/koronahassei.html)||
|Yamanashi    |[新型コロナウイルス感染症の県内における発生状況](https://www.pref.yamanashi.jp/koucho/coronavirus/info_coronavirus_prevention.html)||

**Machine Readable Data Sources**

| Prefecture/City | Dashboard | Patient Data | PCR | Other |
|-----------------|-----------|--------------|-----|-------|
| Fukuoka | [fukuoka.stopcovid19.jp](https://fukuoka.stopcovid19.jp/) |
| Kanagawa | [Dashboard](https://www.pref.kanagawa.jp/osirase/1369/?fbclid=IwAR2-8RAnRsixEpUFpaE-qLflTrAA-DbPaLa9r9SzOobgtGriI-ufROesEKA) || 
| Saitama | [saitama.stopcovid19.jp](https://saitama.stopcovid19.jp/) |
| Tokyo | [stopcovid19.metro.tokyo.lg.jp](https://stopcovid19.metro.tokyo.lg.jp/en/) |

# Data Discrepancies

Our data can sometimes disagree with MHLW or prefectural governments because of different policies we are using to input the data. Here are our known discrepancies and why:

* National death counts. We are counting more deaths than MHLW. Our death counts are aligned with NHK's reporting. We are unclear why MHLW is reporting less deaths.
* Recovery counts. This number is only available in aggregate on a national level from MHLW. Some prefectures report this per patient, some report it in aggregate but there is not consistency in this number. 
* Asymptomatic vs Symptomatic. There are differences between prefectures, some prefectures do not count Asymptomatic confirmed cases. NHK does count all confirmed cases, asymptomatic and symptomatic. We follow that same principle and count all that we can find.
* Okinawa: We count three more cases in Okinawa than the official count because we include 3 US Military Servicemen which are not officially in the Okinawa prefectural government count.