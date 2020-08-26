import * as html from './sources_html.js'

// List of third-party machine readable data sources by prefectures. 

export const sources = {
  aichi: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/code4nagoya/covid19/development/data/data.json'
    },
    summary: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/code4nagoya/covid19/development/data/data.json',
      mainSummaryKey: 'main_summary_history.data',
      deceased: '死亡',
      recovered: '退院',
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.aichi.jp/site/covid19-aichi/corona-kisya.html',
      extract: html.aichiLatestExtract
    },
    gov: {
      patients: 'https://www.pref.aichi.jp/site/covid19-aichi/corona-kisya.html',
      patientList: 'https://www.pref.aichi.jp/site/covid19-aichi/kansensya-kensa.html',
      summary: 'https://www.pref.aichi.jp/site/covid19-aichi/'
    },
    source: 'https://github.com/code4nagoya/covid19',
    dashboard: 'https://stopcovid19.code4.nagoya/',
    cities: {
      nagoya: {
        gov: { patients: 'http://www.city.nagoya.jp/kenkofukushi/page/0000126920.html'  },
        latest: {
          format: 'html',
          url: 'http://www.city.nagoya.jp/kenkofukushi/page/0000126920.html',
          extract: html.aichiNagoyaLatestExtract
        }
      },
      toyohashi: {
        gov: { patients: 'https://www.city.toyohashi.lg.jp/41805.htm' },
        latest: {
          format: 'html',
          url: 'https://www.city.toyohashi.lg.jp/41805.htm',
          extract: html.aichiToyohashiLatestExtract
        }
      },
      okasaki: { 
        gov: { patients: 'https://www.city.okazaki.lg.jp/1550/1562/1615/p025980.html' },
        latest: {
          format: 'html',
          url: 'https://www.city.okazaki.lg.jp/1550/1562/1615/p025980.html',
          extract: html.aichiOkazakiiLatestExtract
        }
      },
      toyota: {
        gov: { patients: 'https://www.city.toyota.aichi.jp/kurashi/kenkou/eisei/1037578.html' }
      }
    }
  },
  akita: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/asaba-zauberer/covid19-akita/development/data/data.json',
      key: 'patients.data'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.akita.lg.jp/pages/archive/47957',
      extract: html.akitaSummaryExtract
    },
    gov: { 
      patients: 'https://www.pref.akita.lg.jp/pages/archive/47957',
      summary: 'https://www.pref.akita.lg.jp/pages/archive/47957'
    },
    cities: {
      akitaCity: {
        gov: { patients: 'https://www.city.akita.lg.jp/bosai-kinkyu/1024149/1024151.html' }
      }
    },
    source: 'https://github.com/asaba-zauberer/covid19-akita/tree/development/data',
    dashboard: 'https://covid19-akita.netlify.app/en'
  },
  aomori: {
    patients: {
      format: 'opendata_csv',
      encoding: 'SJIS',
      url: 'https://opendata.pref.aomori.lg.jp/api/package_show?id=5e4612ce-1636-41d9-82a3-c5130a79ffe0',
      resourceName: '陽性患者関係',
    },
    tests: {
      format: 'opendata_csv',
      encoding: 'SJIS',
      url: 'https://opendata.pref.aomori.lg.jp/api/package_show?id=5e4612ce-1636-41d9-82a3-c5130a79ffe0',
      resourceName: '検査実施状況',
    },
    gov: {
      patients: 'http://www.pref.aomori.lg.jp/welfare/health/wuhan-novel-coronavirus2020.html'
    },
    summary: {
      format: 'html',
      url: 'http://www.pref.aomori.lg.jp/welfare/health/wuhan-novel-coronavirus2020.html',
      extract: html.aomoriSummaryExtract      
    },
    index: 'https://opendata.pref.aomori.lg.jp/api/package_show?id=5e4612ce-1636-41d9-82a3-c5130a79ffe0',
    source: [ 'https://opendata.pref.aomori.lg.jp/dataset/1531.html' ],
    dashboard: 'https://covid19.codeforaomori.org/'
  },
  chiba: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/civictechzenchiba/covid19-chiba/development/data/data.json'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.chiba.lg.jp/shippei/press/2019/ncov-index.html',
      extract: html.chibaSummaryExtract
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.chiba.lg.jp/shippei/press/2019/ncov-index.html',
      extract: html.chibaLatestExtract
    },
    gov: {
      patients: 'https://www.pref.chiba.lg.jp/shippei/press/2019/ncov-index.html',
      summary: 'https://www.pref.chiba.lg.jp/shippei/press/2019/ncov-index.html'
    },
    cities: {
      funabashi: {
        gov: { patients: 'https://www.city.funabashi.lg.jp/kenkou/kansenshou/001/p076941.html' }
      },
      chibaCity: {
        gov: { patients: 'https://www.city.chiba.jp/hokenfukushi/iryoeisei/seisaku/covid-19/kanjamatome.html' }
      },
    },
    source: 'https://github.com/civictechzenchiba/covid19-chiba',
    dashboard: 'https://covid19.civictech.chiba.jp/'
  },
  ehime: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/ehime-covid19/covid19/master/data/data.json',
    },
    // summary: {
    //   format: 'json',
    //   url: 'https://raw.githubusercontent.com/ehime-covid19/covid19/master/data/data.json',
    //   deceased: 'main_summary.children[0].children[2].value',
    //   recovered: 'main_summary.children[0].children[1].value',
    // },
    gov: {
      patients: 'https://www.pref.ehime.jp/h25500/kansen/covid19.html',
      summary: 'https://www.pref.ehime.jp/h25500/kansen/documents/kennai_link.pdf'
    },
    cities: {
      matsuyama: {
        gov: { patients: 'https://www.city.matsuyama.ehime.jp/kurashi/iryo/hokenyobo/kansensho/tyuui/sinngatakorona.html' }
      }
    },
    source: 'https://github.com/ehime-covid19/covid19',
    dashboard: 'https://ehime-covid19.com/'
  },

  fukui: {
    patients: {
      format: 'csv',
      url: 'https://www.pref.fukui.lg.jp/doc/toukei-jouhou/covid-19_d/fil/covid19_patients.csv'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.fukui.lg.jp/doc/kenkou/corona/jyoukyou.html',
      extract: html.fukuiSummaryExtract
    },
    tests: {
      format: 'csv',
      url: 'https://www.pref.fukui.lg.jp/doc/toukei-jouhou/covid-19_d/fil/covid19_test_count.csv'
    },
    gov: {
      patients: 'https://www.pref.fukui.lg.jp/doc/kenkou/corona/jyoukyou.html',
      summary: 'https://www.pref.fukui.lg.jp/doc/kenkou/corona/jyoukyou.html'
    },
    dashboard: 'https://www.pref.fukui.lg.jp/doc/kenkou/corona/jyoukyou.html'
  },
  fukuoka: {
    patients: {
      format: 'csv',
      url: 'https://ckan.open-governmentdata.org/dataset/8a9688c2-7b9f-4347-ad6e-de3b339ef740/resource/c27769a2-8634-47aa-9714-7e21c4038dd4/download/400009_pref_fukuoka_covid19_patients.csv'
    },
    tests: {
      format: 'csv',
      url: 'https://ckan.open-governmentdata.org/dataset/ef64c68a-d89e-4b1b-a53f-d2535ebfa3a1/resource/aab43191-40d0-4a6a-9724-a9030a596009/download/400009_pref_fukuoka_covid19_exam.csv'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.fukuoka.lg.jp/contents/covid19-hassei.html',
      extract: html.fukuokaSummaryExtract
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.fukuoka.lg.jp/contents/covid19-hassei.html',
      extract: html.fukuokaLatestExtract
    },
    gov: {
      patients: 'https://www.pref.fukuoka.lg.jp/contents/covid19-hassei.html',
      summary: 'https://www.pref.fukuoka.lg.jp/contents/covid19-hassei.html',
    },
    cities: {
      fukuokaCity: {
        gov: { 
          patients: 'https://www.city.fukuoka.lg.jp/hofuku/hokenyobo/health/kansen/cohs.html',
          summary: 'https://www.city.fukuoka.lg.jp/hofuku/hokenyobo/health/kansen/cohs.html' 
        }
      },
      kitakyushu: {
        gov: {
          patients: 'https://www.city.kitakyushu.lg.jp/kurashi/menu01_00278.html',
          summary: 'https://www.city.kitakyushu.lg.jp/ho-huku/18901209.html'
        }
      },
      kurume: {
        gov: {
          patients: 'http://www.city.kurume.fukuoka.jp/1050kurashi/2060hokeneisei/3005cov2019/index.html#corona-ind9'
        }
      },
    },
    source: 'https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_patients',
    dashboard: 'https://fukuoka.stopcovid19.jp/',
  },
  fukushima: {
    patients: {
      format: 'csvdir',
      encoding: 'sjis',
      url: 'http://www.pref.fukushima.lg.jp/w4/covid19/patients/'
    },
    summary: {
      format: 'json',
      url: 'https://cdn2.dott.dev/data.json',
      tested: 'main_summary.value',
      confirmed: 'main_summary.children[0].value',
      deceased: 'main_summary.children[0].children[2].value',
      recovered: 'main_summary.children[0].children[1].value'
    },
    gov: {
      patients: 'https://www.pref.fukushima.lg.jp/sec/21045c/fukushima-hasseijyoukyou.html'
    },
    source: 'http://www.pref.fukushima.lg.jp/w4/covid19/patients/',
    dashboard: 'https://fukushima-covid19.firebaseapp.com/'
  },
  gifu: {
    patients: {
      format: 'csv',
      encoding: 'sjis',
      url: 'https://data.gifu-opendata.pref.gifu.lg.jp/dataset/4661bf9d-6f75-43fb-9d59-f02eb84bb6e3/resource/9c35ee55-a140-4cd8-a266-a74edf60aa80/download/210005gifucovid19patients.csv',
      index: 'https://data.gifu-opendata.pref.gifu.lg.jp/dataset/c11223-001/resource/9c35ee55-a140-4cd8-a266-a74edf60aa80'
    },
    gov: {
      patients: 'https://www.pref.gifu.lg.jp/kinkyu-juyo-joho/shingata_corona_kansendoko.html',
      summary: 'https://www.pref.gifu.lg.jp/kinkyu-juyo-joho/shingata_corona_kansendoko.html'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.gifu.lg.jp/kinkyu-juyo-joho/shingata_corona_kansendoko.html',
      extract: html.gifuSummaryExtract
    }, 
    source: 'https://github.com/CODE-for-GIFU/covid19/blob/development/api/sheet.js',
    dashboard: 'https://covid19-gifu.netlify.app/',
  },
  gunma: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/bpr-gunma/covid19/development/data/data.json'
    },
    gov: {
      patients: 'https://www.pref.gunma.jp/07/z87g_00016.html',
      summary: 'https://stopcovid19.pref.gunma.jp/',
      deaths: 'https://www.pref.gunma.jp/07/z87g_00025.html'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.gunma.jp/07/z87g_00016.html',
      extract: html.gunmaSummaryExtract
    },
    cities: {
      maebashi: {
        gov: { 
          patients: 'https://www.city.maebashi.gunma.jp/kurashi_tetsuzuki/covid19_info/4/index.html',
          patientList: 'https://www.city.maebashi.gunma.jp/kurashi_tetsuzuki/covid19_info/4/23696.html',
        }
      }
    },
    source: 'https://github.com/bpr-gunma/covid19',
    dashboard: 'https://stopcovid19.pref.gunma.jp/'
  },
  hiroshima: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/tatsuya1970/covid19/development/data/data.json',
    },
    gov: {
      patients: 'https://www.pref.hiroshima.lg.jp/site/hcdc/covid19-kanjya.html',
      summary: 'https://www.pref.hiroshima.lg.jp/soshiki/57/covid19-cases.html',
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.hiroshima.lg.jp/soshiki/57/covid19-cases.html',
      extract: html.hiroshimaSummaryExtract
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.hiroshima.lg.jp/site/hcdc/covid19-kanjya.html',
      extract: html.hiroshimaLatestExtract
    },
    cities: {
      hiroshimaCity: {
        gov: {
          patients: 'https://www.city.hiroshima.lg.jp/site/korona/108656.html'
        },
      },
      fukuyama: {
        gov: {
          patients: 'http://www.city.fukuyama.hiroshima.jp/soshiki/hokenyobo/'
        }
      },
    },
    source: 'https://github.com/tatsuya1970/covid19',
    dashboard: 'https://covid19-hiroshima.netlify.app/en'
  },
  hokkaido: {
    patients: {
      format: 'csv',
      encoding: 'SJIS',
      url: 'https://www.harp.lg.jp/opendata/dataset/1369/resource/2828/patients.csv'
    },
    summary: {
      format: 'html',
      url: 'http://www.pref.hokkaido.lg.jp/ss/tkk/singatakoronahaien.htm',
      extract: html.hokkaidoSummaryExtract
    },    
    latest: {
      format: 'html',
      url: 'http://www.pref.hokkaido.lg.jp/hf/kth/kak/hasseijoukyou.htm',
      extract: html.hokkaidoLatestExtract
    },
    gov: {
      patients: 'http://www.pref.hokkaido.lg.jp/hf/kth/kak/hasseijoukyou.htm',
      summary: 'http://www.pref.hokkaido.lg.jp/ss/ssa/singatakoronahaien.htm',
    },
    cities: {
      sapporo: {
        gov: { 
          patients: 'https://www.city.sapporo.jp/hokenjo/f1kansen/2019n-covhassei.html' ,
          summary: 'https://www.city.sapporo.jp/hokenjo/f1kansen/2019n-covhassei.html'
        }
      }
    },
    source: [ 'https://www.harp.lg.jp/opendata/dataset/1369.html' ],
    dashboard: 'https://stopcovid19.hokkaido.dev/'
  },
  hyogo: {
    patients: {
      format: 'json',
      key: 'data',
      url: 'https://raw.githubusercontent.com/stop-covid19-hyogo/covid19/development/data/patients.json'
    },
    gov: {
      patients: 'https://web.pref.hyogo.lg.jp/kk03/corona_hasseijyokyo.html',
      summary: 'https://web.pref.hyogo.lg.jp/kk03/200129.html#kensa_new',
      deaths: 'https://web.pref.hyogo.lg.jp/kk03/singatakoronataiou.html'
    },
    summary: {
      format: 'html',
      url: 'https://web.pref.hyogo.lg.jp/kk03/200129.html#kensa_new',
      extract: html.hyogoSummaryExtract
    },
    latest: {
      format: 'url',
      url: 'https://web.pref.hyogo.lg.jp/kk03/corona_hasseijyokyo.html',
      extract: html.hyogoLatestExtract
    },
    cities: {
      himeji: {
        gov: {
          patients: 'https://www.city.himeji.lg.jp/emergencyinfo/0000000179.html',
        }
      },
      nishinomiya: {
        gov: {
          patients: 'https://www.nishi.or.jp/kurashi/anshin/infomation/k_00022020111.html',
          summary: 'https://www.nishi.or.jp/kurashi/anshin/infomation/k_00022020111.html'
        }
      },
      akashi: {
        gov: { 
          patients: 'https://www.city.akashi.lg.jp/anshin/anzen/coronataiyo.html',
          patientList: 'https://www.city.akashi.lg.jp/anshin/corona/sinai_kansen.html' 
        }
      },
      kobe: {
        gov: { 
          patients: 'https://www.city.kobe.lg.jp/a97852/coronazokusei501_600.html',
          patientList: 'https://www.city.kobe.lg.jp/a97852/coronazokusei501_600.html',
          summary: 'https://www.city.kobe.lg.jp/a73576/kenko/health/infection/protection/covid_19.html',
        }
      },
      amagasaki: {
        gov: { patients: 'https://www.city.amagasaki.hyogo.jp/kurashi/kenko/kansensyo/1020379.html' }
      },
    },
    source: 'https://github.com/stop-covid19-hyogo/covid19',
    dashboard: 'https://stop-covid19-hyogo.org/'
  },
  ibaraki: {
    patients: {
      format: 'json',
      key: 'patients.data',
      url: 'https://raw.githubusercontent.com/a01sa01to/covid19-ibaraki/development/data/data.json'
    },
    gov: {
      patients: 'https://www.pref.ibaraki.jp/1saigai/2019-ncov/hassei.html',
      summary: 'https://www.pref.ibaraki.jp/1saigai/2019-ncov/index.html',
      deaths: 'https://www.pref.ibaraki.jp/1saigai/2019-ncov/0401d.html',
      patientList: 'https://www.pref.ibaraki.jp/1saigai/2019-ncov/ichiran.html'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.ibaraki.jp/1saigai/2019-ncov/index.html',
      extract: html.ibarakiSummaryExtract
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.ibaraki.jp/1saigai/2019-ncov/hassei.html',
      extract: html.ibarakiLatestExtract
    },
    cities: {
      mito: {
        gov: { patients: 'https://www.city.mito.lg.jp/001245/hokenjo/kansensyou/p021677.html' }
      }
    },
    source: 'https://github.com/a01sa01to/covid19-ibaraki/tree/development/data',
    dashboard: 'https://ibaraki.stopcovid19.jp/'
  },
  ishikawa: {
    patients: {
      format: 'json',
      key: 'data',
      url: 'https://raw.githubusercontent.com/Retsuki/covid19-ishikawa-scraper/master/src/data.json'
    },
    gov: {
      patients: 'https://www.pref.ishikawa.lg.jp/kansen/coronakennai.html',
      summary: 'https://www.pref.ishikawa.lg.jp/kansen/coronakennai.html',
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.ishikawa.lg.jp/kansen/coronakennai.html',
      extract: html.ishikawaSummaryExtract
    },
    source: 'https://github.com/Retsuki/covid19-ishikawa',
    dashboard: 'https://ishikawa-covid19.netlify.app/'
  },
  iwate: {
    gov: {
      patients: 'https://www.pref.iwate.jp/kurashikankyou/iryou/covid19/1029635/index.html'
    },
  },
  kagawa: {
    patients: {
      format: 'json',
      key: 'data',
      url: 'https://raw.githubusercontent.com/codeforkagawa/covid19/development/data/patients.json'
    },
    gov: {
      patients: 'https://www.pref.kagawa.lg.jp/content/dir1/dir1_6/dir1_6_1/index.shtml',
      summary: 'https://www.pref.kagawa.lg.jp/content/etc/subsite/kansenshoujouhou/kansen/se9si9200517102553.shtml'
    },
    summary: {
      format: 'html',
      encoding: 'EUCJP',
      url: 'https://www.pref.kagawa.lg.jp/content/etc/subsite/kansenshoujouhou/kansen/se9si9200517102553.shtml',
      extract: html.kagawaSummaryExtract
    },
    source: 'https://github.com/codeforkagawa/covid19',
    dashboard: 'https://kagawa.stopcovid19.jp/en'
  },
  kanagawa: {
    patients: {
      format: 'csv',
      encoding: 'SJIS',
      url: 'http://www.pref.kanagawa.jp/osirase/1369/data/csv/patient.csv'
    },
    gov: {
      patients: 'https://www.pref.kanagawa.jp/docs/ga4/bukanshi/occurrence.html',
      pressRelease: 'https://www.pref.kanagawa.jp/prs/list-2020-1-1.html',
      summary: 'https://www.pref.kanagawa.jp/docs/ga4/bukanshi/occurrence.html',
      deaths: 'https://www.pref.kanagawa.jp/prs/list-2020-1-1.html'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.kanagawa.jp/docs/ga4/bukanshi/occurrence.html',
      extract: html.kanagawaSummaryExtract
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.kanagawa.jp/docs/ga4/bukanshi/occurrence_07.html',
      extract: html.kanagawaLatestExtract
    },
    cities: {
      chigasaki: {
        gov: { 
          patients: 'https://www.city.chigasaki.kanagawa.jp/kenko/1022933/1038284.html',
          deaths: 'https://www.city.chigasaki.kanagawa.jp/koho/1030702/1038773/index.html'
        },
        latest: { 
          format: 'html',
          url: 'https://www.city.chigasaki.kanagawa.jp/kenko/1022933/1038284.html',
          extract: html.chigasakiLatestExtract
        }
      },
      fujisawa: {
        gov: { patients: 'https://www.city.fujisawa.kanagawa.jp/hokenyobo/kansensho/korona.html' },
        latest: { 
          format: 'html',
          url: 'https://www.city.fujisawa.kanagawa.jp/hokenyobo/kansensho/korona.html',
          extract: html.fujisawaLatestExtract
        }
      },
      kawasaki: {
        gov: { patients: 'http://www.city.kawasaki.jp/350/page/0000115886.html' },
        latest: { 
          format: 'html',
          url: 'http://www.city.kawasaki.jp/350/page/0000115886.html',
          extract: html.kawasakiLatestExtract
        }
      },
      sagamihara: {
        gov: { patients: 'https://www.city.sagamihara.kanagawa.jp/shisei/koho/1019191.html' },
        latest: { 
          format: 'html',
          url: 'https://www.city.sagamihara.kanagawa.jp/shisei/koho/1019191.html',
          extract: html.sagamiharaLatestExtract
        }
      },

      yokohama: {
        gov: { 
          patients: 'https://www.city.yokohama.lg.jp/city-info/koho-kocho/press/' ,
          summary: 'https://www.city.yokohama.lg.jp/city-info/koho-kocho/koho/topics/corona-data.html',
          deaths: 'https://www.city.yokohama.lg.jp/city-info/koho-kocho/press/',
          patientList: 'https://www.city.yokohama.lg.jp/kurashi/kenko-iryo/yobosesshu/kansensho/coronavirus/kanja.html',
        },
        latest: {
          format: 'html',
          url:  'https://www.city.yokohama.lg.jp/kurashi/kenko-iryo/yobosesshu/kansensho/coronavirus/kanja.html' ,
          extract: html.yokohamaLatestExtract
        },
        summary: {
          format: 'html',
          url: 'https://www.city.yokohama.lg.jp/city-info/koho-kocho/koho/topics/corona-data.html',
          extract: html.yokohamaSummaryExtract
        },
        dashboard: 'https://covid19.yokohama/',
        source: 'https://github.com/covid19yokohama/covid19'
      },
      yokosuka: {
        gov: { 
          patients: 'https://www.city.yokosuka.kanagawa.jp/3130/hasseijoukyou.html',
          deaths: 'https://www.city.yokosuka.kanagawa.jp/0520/nagekomi/2020_5.html' 
        },
        latest: {
          format: 'html',
          url:  'https://www.city.yokosuka.kanagawa.jp/3130/hasseijoukyou.html',
          extract: html.yokosukaLatestExtract
        },
      },
    },
    dashboard: 'https://www.pref.kanagawa.jp/osirase/1369/'
  },
  kagoshima: {
    gov: {
      patients: 'https://www.pref.kagoshima.jp/ae06/kenko-fukushi/kenko-iryo/kansen/kansensho/coronavirus.html#kokunai'
    },
    cities: {
      kagoshimaCity: {
        gov: { patients: 'https://www.city.kagoshima.lg.jp/soumu/shichoshitu/kouhou/covid-19/jyoukyousiryou.html' }
      }
    },
    dashboard: 'https://covid19.code4kagoshima.org/en',
  },
  kochi: {
    gov: {
      patients: 'https://www.pref.kochi.lg.jp/soshiki/130401/2020022900049.html',
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.kochi.lg.jp/soshiki/130401/2020022900049.html',
      extract: html.kochiSummaryExtract
    }

  },
  kumamoto: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/codeforkumamoto/covid19/development/data/data.json',
    },
    gov: {
      patients: 'https://www.pref.kumamoto.jp/kiji_32300.html',
      data: 'https://www.pref.kumamoto.jp/common/UploadFileOutput.ashx?c_id=3&id=22038&sub_id=7&flid=231833',
      dataIndex: 'https://www.pref.kumamoto.jp/kiji_22038.html',
    },
    summary: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/codeforkumamoto/covid19/development/data/data.json',
      tested: 'main_summary.value',
      confirmed: 'main_summary.children[0].value',
      deceased: 'main_summary.children[0].children[2].value',
      recovered: 'main_summary.children[0].children[1].value'
    },
    cities: {
      kumamotoCity: { gov: { patients: 'https://www.city.kumamoto.jp/corona/hpKiji/pub/detail.aspx?c_id=5&id=27681&class_set_id=22&class_id=3261 '}}
    },
    source: 'https://github.com/codeforkumamoto/covid19',
    dashboard: 'https://kumamoto.stopcovid19.jp/',
  },
  kyoto: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/stopcovid19-kyoto/covid19/development/data/data.json'
    },
    gov: {
      patients: 'https://www.pref.kyoto.jp/kentai/corona/hassei1-50.html',
      summary: 'https://www.pref.kyoto.jp/kentai/corona/pcrkensa.html'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.kyoto.jp/kentai/corona/pcrkensa.html',
      extract: html.kyotoSummaryExtract
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.kyoto.jp/kentai/news/novelcoronavirus.html#F',
      extract: html.kyotoLatestExtract
    },
    cities: {
      kyotoCity: {
        gov: {
          news: 'https://www.city.kyoto.lg.jp/',
          patients: 'https://www.city.kyoto.lg.jp/hokenfukushi/page/0000266641.html',
          deaths: 'https://www.city.kyoto.lg.jp/menu3/category/36-6-1-0-0-0-0-0-0-0.html'
        },
        latest: {
          format: 'html',
          url: 'https://www.city.kyoto.lg.jp/hokenfukushi/page/0000266641.html',
          extract: html.kyotoCityLatestExtract
        },
      },
      muko: {
        gov: {
          patients: 'https://www.city.muko.kyoto.jp/kurashi/soshiki/biminnsabisubu/2/1/kinkyu/1585555920594.html'
        }
      }
    },
    source: 'https://github.com/stopcovid19-kyoto/covid19',
    dashboard: 'https://stopcovid19-kyoto.netlify.app/',
  },
  mie: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/FlexiblePrintedCircuits/covid19-mie/develop/data/data.json'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.mie.lg.jp/YAKUMUS/HP/m0068000066_00002.htm',
      extract: html.mieSummaryExtract
    },
    gov: {
      patients: 'https://www.pref.mie.lg.jp/YAKUMUS/HP/m0068000066_00002.htm',
      summary: 'https://www.pref.mie.lg.jp/YAKUMUS/HP/m0068000066_00002.htm'
    },
    source: 'https://github.com/FlexiblePrintedCircuits/covid19-mie',
    dashboard: 'https://mie.stopcovid19.jp/',
  },
  miyagi: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/code4shiogama/covid19-miyagi/development/data/data.json'
    },
    gov: {
      patients: 'https://www.pref.miyagi.jp/site/covid-19/02.html',
      summary: 'https://www.pref.miyagi.jp/site/covid-19/02.html'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.miyagi.jp/site/covid-19/02.html',
      extract: html.miyagiSummaryExtract
    },
    cities: {
      sendai: {
        gov: {
          patients: 'https://www.city.sendai.jp/kikikanri/kinkyu/200131corona2.html'
        }
      }
    },
    source: 'https://github.com/code4shiogama/covid19-miyagi/tree/development/data',
    dashboard: 'https://miyagi.stopcovid19.jp/'
  },
  miyazaki: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/covid19-miyazaki/covid19/development/data/data.json'
    },
    gov: {
      patients: 'https://www.pref.miyazaki.lg.jp/kansensho-taisaku/covid-19/hassei_list.html'
    },
    source: 'https://github.com/covid19-miyazaki/covid19',
    dashboard: 'https://covid19-miyazaki.netlify.app/'
  },
  nagano: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/kanai3id/covid19/development/data/data.json',
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.nagano.lg.jp/hoken-shippei/kenko/kenko/kansensho/joho/corona-doko.html',
      extract: html.naganoSummaryExtract
    },    
    gov: {
      patients: 'https://www.pref.nagano.lg.jp/kensei/koho/pressreleases/index.html',
      summary: 'https://www.pref.nagano.lg.jp/hoken-shippei/kenko/kenko/kansensho/joho/corona-doko.html'
    },
    cities: {
      naganoCity: {
        gov: {
          patients: 'https://www.city.nagano.nagano.jp/site/covid19-joho/451795.html'
        }
      }
    },
    source: 'https://github.com/kanai3id/covid19',
    dashboard: 'https://covid19-nagano.info/en'
  },
  nagasaki: {
    patients: {
      format: 'csv',
      url: 'http://data.bodik.jp/dataset/09951e04-dc5d-42e9-9a49-37443be6787e/resource/de7ce61e-1849-47a1-b758-bca3f809cdf8/download/20200428prefnagasakicovidpatients.csv',
      source: 'https://data.bodik.jp/dataset/420000_covidpatients/resource/de7ce61e-1849-47a1-b758-bca3f809cdf8'
    },
    summary: {
      format: 'csv',
      url: 'https://data.bodik.jp/dataset/420000_covidcounts/resource/438f03f1-0ee8-466d-a5d9-e874f5367507'
    },
    gov: {
      patients: 'https://www.pref.nagasaki.jp/bunrui/hukushi-hoken/kansensho/corona_nagasaki/corona_nagasaki_shousai/',
      patientList: 'https://twitter.com/ngs_ken_iryou',
      deaths: 'https://twitter.com/ngs_ken_iryou',
    },
    cities: {
      nagasakiCity: {
        gov: {
          patients: 'https://www.city.nagasaki.lg.jp/fukushi/450000/454000/p034301.html'
        }
      },
      sasebo: {
        gov: {
          patients: 'https://www.city.sasebo.lg.jp/hokenhukusi/kenkou/covid19-hasseijokyo.html'
        }
      },
      isahaya: {
        gov: { patients: 'https://www.city.isahaya.nagasaki.jp/post77/64813.html' }
      },
    },
    source: 'https://github.com/CodeForNagasaki/covid19',
    dashboard: 'https://nagasaki.stopcovid19.jp/'
  },
  nara: {
    naracity: {
      patients: {
        format: 'json',
        url: 'https://raw.githubusercontent.com/code4nara/covid19/development/data/data_naracity.json'
      }
    },
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/code4nara/covid19/development/data/data.json'
    },
    summary: {
      format: 'html',
      url: 'http://www.pref.nara.jp/module/1356.htm',
      extract: html.naraSummaryExtract
    },
    gov: {
      patients: 'http://www.pref.nara.jp/module/1356.htm#moduleid1356',
      summary: 'http://www.pref.nara.jp/module/1356.htm'
    },
    source: 'https://github.com/code4nara/covid19',
    dashboard: 'https://stopcovid19.code4nara.org/'
  },
  niigata: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/CodeForNiigata/covid19/development/data/data.json',
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.niigata.lg.jp/site/shingata-corona/hasseijokyo-covid19-niigataken.html',
      extract: html.niigataLatestExtract
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.niigata.lg.jp/site/shingata-corona/#status',
      extract: html.niigataSummaryExtract
    },
    gov: {
      patients: 'https://www.pref.niigata.lg.jp/site/shingata-corona/256362836.html',
      summary: 'https://www.pref.niigata.lg.jp/site/shingata-corona/#status'
    },
    cities: {
      niigataCity: {
        gov: {
          patients: 'https://www.city.niigata.lg.jp/iryo/kenko/yobou_kansen/kansen/covid-19/hasseizyoukyou.html'
        }
      }
    },
    source: 'https://github.com/CodeForNiigata/covid19',
    dashboard: 'https://niigata.stopcovid19.jp/'
  },
  oita: {
    patients: {
      format: 'csv',
      url: 'https://data.bodik.jp/dataset/f632f467-716c-46aa-8838-0d535f98b291/resource/3714d264-70f3-4518-a57a-8391e0851d7d/download/440001oitacovid19patients.csv'
    },
    tests: {
      format: 'csv',
      url: 'https://data.bodik.jp/dataset/f632f467-716c-46aa-8838-0d535f98b291/resource/96440e66-3061-43d6-adf3-ef1f24211d3a/download/440001oitacovid19datasummary.csv'
    },
    latest: {
      format: 'html',
      url: 'http://www.pref.oita.jp/site/covid19-oita/covid19-pcr.html',
      extract: html.oitaLatestExtract
    },
    summary: {
      format: 'html',
      url: 'http://www.pref.oita.jp/site/covid19-oita/covid19-pcr.html',
      extract: html.oitaSummaryExtract
    },
    gov: {
      patients: 'http://www.pref.oita.jp/site/covid19-oita/covid19-pcr.html',
      summary: 'http://www.pref.oita.jp/site/covid19-oita/covid19-pcr.html'
    },
    cities: {
      oitaCity: {
        gov: {
          patients: 'https://www.city.oita.oita.jp/o096/kenko/hoken/1137572759760.html'
        }
      }
    },
    source: 'https://data.bodik.jp/dataset/_covid19',
    dashboard: 'https://oita.stopcovid19.jp/en'
  },
  okayama: {
    patients: {
      format: 'csv',
      encoding: 'sjis',
      url: 'http://www.okayama-opendata.jp/ckan/dataset/e6b3c1d2-2f1f-4735-b36e-e45d36d94761/resource/c6503ebc-b2e9-414c-aae7-7374f4801e21/download/kansenshajouhou.csv',
    },
    tests: {
      format: 'csv',
      encoding: 'sjis',
      url: 'http://www.okayama-opendata.jp/ckan/dataset/e6b3c1d2-2f1f-4735-b36e-e45d36d94761/resource/60ecd874-0f71-4d9f-9a8a-936fad9c99bc/download/pcr.csv'
    },
    gov: {
      summary: 'https://www.pref.okayama.jp/page/645925.html#03-kennaijoukyou',
      patients: 'https://www.pref.okayama.jp/page/667843.html',
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.okayama.jp/page/645925.html',
      extract: html.okayamaSummaryExtract      
    },
    source: 'http://www.okayama-opendata.jp/opendata/ga120PreAction.action?keyTitle=d9c4776db7f09fff161953a2aaf03b80a9abad48&datasetId=e6b3c1d2-2f1f-4735-b36e-e45d36d94761',
    dashboard: 'https://okayama.stopcovid19.jp/'
  },
  okinawa: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/Code-for-OKINAWA/covid19/development/data/data.json'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.okinawa.jp/site/hoken/chiikihoken/kekkaku/covid19_hasseijoukyou.html',
      extract: html.okinawaSummaryExtract
    },
    gov: {
      patients: 'https://www.pref.okinawa.lg.jp/site/hoken/chiikihoken/kekkaku/press/20200214_covid19_pr1.html',
      summary: 'https://www.pref.okinawa.jp/site/hoken/chiikihoken/kekkaku/covid19_hasseijoukyou.html',
      deaths: 'https://www.pref.okinawa.jp/site/hoken/chiikihoken/kekkaku/press/20200416_covid19_pr.html'
    },
    source: 'https://github.com/Code-for-OKINAWA/covid19/tree/development/data',
    dashboard: 'https://okinawa.stopcovid19.jp/'
  },
  osaka: {
    patients: {
      format: 'json', 
      url: 'https://raw.githubusercontent.com/codeforosaka/covid19/development/data/data.json',
      key: 'patients.data'

    },
    summary: {
      format: 'html',
      encoding: 'SJIS',
      url: 'http://www.pref.osaka.lg.jp/iryo/osakakansensho/corona.html',
      extract: html.osakaSummaryExtract
    },
    gov: {
      patients: 'http://www.pref.osaka.lg.jp/hodo/index.php?HST_TITLE1=%83R%83%8D%83i&SEARCH_NUM=10&searchFlg=%8C%9F%81@%8D%F5&site=fumin',
      summary: 'http://www.pref.osaka.lg.jp/iryo/osakakansensho/corona.html'
    },
    latest: {
      format: 'html',
      encoding: 'SJIS',
      url: 'http://www.pref.osaka.lg.jp/hodo/index.php?HST_TITLE1=%83R%83%8D%83i&SEARCH_NUM=10&searchFlg=%8C%9F%81@%8D%F5&site=fumin',
      extract: html.osakaLatestExtract
    },
    source: 'https://github.com/codeforosaka/covid19',
    dashboard: 'https://covid19-osaka.info/'
  },
  saga: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/codeforsaga/covid19/development/data/data.json'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.saga.lg.jp/kiji00373220/index.html',
      extract: html.sagaSummaryExtract
    },
    gov: {
      patients: 'https://www.pref.saga.lg.jp/kiji00373220/index.html'
    },
    source: 'https://github.com/codeforsaga/covid19/tree/development/data',
    dashboard: 'https://stopcovid19.code4saga.org/en'
  },
  saitama: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/codefortoda/covid19-saitama/development/data/data.json'
    },
    gov: {
      summary: 'https://www.pref.saitama.lg.jp/a0701/shingatacoronavirus.html',
      patients: 'https://www.pref.saitama.lg.jp/kense/shiryo/nyu-su/2020/8gatsu/index.html',
      patientList: 'https://www.pref.saitama.lg.jp/a0701/covid19/jokyo.html'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.saitama.lg.jp/a0701/shingatacoronavirus.html',
      extract: html.saitamaSummaryExtract
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.saitama.lg.jp/kense/shiryo/nyu-su/2020/7gatsu/index.html',
      extract: html.saitamaLatestExtract
    },
    cities: {
      kawaguchi: {
        gov: { patients: "https://www.city.kawaguchi.lg.jp/soshiki/01090/018/30169.html" }
      },
      saitamaCity: {
        gov: {
          patients: 'https://www.city.saitama.jp/002/001/008/006/013/001/p070442.html',
          sum: 'https://www.city.saitama.jp/002/001/008/006/013/001/p070442.html'
        }
      },
      koshigaya: {
        gov: {
          patients: 'https://www.city.koshigaya.saitama.jp/kurashi_shisei/fukushi/hokenjo/kansensho/kansensyo/index.html',
          summary: 'https://www.city.koshigaya.saitama.jp/kurashi_shisei/fukushi/hokenjo/kansensho/koshigaya_contents0310.html'
        }
      },
      kawagoe: {
        gov: {
          patients: 'https://www.city.kawagoe.saitama.jp/kenkofukushi/byoki_iryo/kansensho/index.html'
        }
      },
    },
    source: 'https://opendata.pref.saitama.lg.jp/data/dataset/covid19-jokyo',
    dashboard: 'https://saitama.stopcovid19.jp/'
  },
  shiga: {
    gov: {
      patients: 'https://www.pref.shiga.lg.jp/ippan/kenkouiryouhukushi/yakuzi/310735.html',
      summary: 'https://www.pref.shiga.lg.jp/ippan/kenkouiryouhukushi/yakuzi/309252.html'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.shiga.lg.jp/ippan/kenkouiryouhukushi/yakuzi/309252.html',
      extract: html.shigaSummaryExtract
    },
    source: 'https://github.com/shiga-pref-org/covid19',
    dashboard: 'https://stopcovid19.pref.shiga.jp/',
  },
  shimane: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/TaigaMikami/shimane-covid19/shimane/data/data.json'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.shimane.lg.jp/bousai_info/bousai/kikikanri/shingata_taisaku/new_coronavirus_portal.html',
      extract: html.shimaneSummaryExtract
    },
    gov: {
      patients: 'https://www.pref.shimane.lg.jp/bousai_info/bousai/kikikanri/shingata_taisaku/new_coronavirus_portal.html'
    },
    source: 'https://github.com/TaigaMikami/shimane-covid19/',
    dashboard: 'https://shimane-covid19.netlify.app/en'
  },
  shizuoka: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/hiroyuki-ichikawa/covid19/development/data/data.json'
    },
    gov: {
      patients: 'https://www.pref.shizuoka.jp/kinkyu/covid-19-tyuumokujouhou.html',
      summary: 'https://www.pref.shizuoka.jp/kinkyu/covid-19.html',
      citySummary: 'https://www.pref.shizuoka.jp/kinkyu/covid-19-bunnpujoukyou.html'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.shizuoka.jp/kinkyu/covid-19.html',
      extract: html.shizuokaSummaryExtract
    },
    source: 'https://github.com/hiroyuki-ichikawa/covid19',
    dashboard: 'https://stopcovid19.code4numazu.org/en',
    cities: {
      shizuokaCity: {
        gov: {
          patients: 'https://www.city.shizuoka.lg.jp/388_000109.html'
        },
        source: 'https://github.com/kazuomatz/covid19',
        dashboard: 'https://stopcovid19.city.shizuoka.lg.jp/'
      },
      hanamatsu: {
        gov: { patients: 'https://www.city.hamamatsu.shizuoka.jp/koho2/emergency/korona_kanjya.html' },
        patients: {
          url: 'https://opendata.pref.shizuoka.jp/dataset/8113/resource/44704/221309_hamamatsu_covid19_patients.csv'
        },
        source: 'https://opendata.pref.shizuoka.jp/dataset/8113.html',
        dashboard: 'https://stopcovid19-hamamatsu.netlify.app/en'
      },
    }
  },
  tochigi: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/covid19-tochigi/covid19/development/data/data.json'
    },
    summary: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/covid19-tochigi/covid19/development/data/data.json',
      tested: 'main_summary.value',
      confirmed: 'main_summary.children[0].value',
      deceased: 'main_summary.children[0].children[2].value',
      recovered: 'main_summary.children[0].children[1].value'
    },
    gov: {
      patients: 'http://www.pref.tochigi.lg.jp/c05/kouhou/korona.html#houdou',
      patientList: 'http://www.pref.tochigi.lg.jp/e04/welfare/hoken-eisei/kansen/hp/coronakensahasseijyoukyou.html',
      summary: 'http://www.pref.tochigi.lg.jp/e04/welfare/hoken-eisei/kansen/hp/coronakensahasseijyoukyou.html'
    },
    cities: {
      utsunomiya: {
        gov: {
          patients: 'https://www.city.utsunomiya.tochigi.jp/kurashi/kenko/kansensho/etc/1023506.html'
        }
      }
    },
    sheet: 'https://docs.google.com/spreadsheets/d/1aCIRyol3UncEtstWhT_Yw3I8mCbvpGQU5_HUKB_0JFA/edit#gid=0',
    source: 'https://github.com/covid19-tochigi/covid19',
    dashboard: 'https://covid19-tochigi.netlify.app/'
  },
  tokushima: {
    gov: {
      patients: 'https://www.pref.tokushima.lg.jp/ippannokata/kenko/kansensho/5034012#25'
    }
  },
  
  tokyo: {
    patients: { 
      format: 'csv',
      url: 'https://stopcovid19.metro.tokyo.lg.jp/data/130001_tokyo_covid19_patients.csv'
    },
    summary: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/tokyo-metropolitan-gov/covid19/development/data/data.json',
      tested: 'main_summary.value',
      confirmed: 'main_summary.children[0].value',
      deceased: 'main_summary.children[0].children[2].value',
      recovered: 'main_summary.children[0].children[1].value'
    },
    gov: {
      patients: 'https://www.fukushihoken.metro.tokyo.lg.jp/hodo/index.html'
    },
    source: 'https://github.com/tokyo-metropolitan-gov/covid19',
    dashboard: 'https://stopcovid19.metro.tokyo.lg.jp/',
    dashboards: [
      'https://covid19tokyo.live/'
    ]
  },
  tottori: {
    gov: {
      patients: 'https://www.pref.tottori.lg.jp/corona-virus/',
      summary: 'https://www.pref.tottori.lg.jp/item/1205989.htm#itemid1205989'
    },
    dashboard: 'https://tottori-covid19.netlify.app/en'
  },
  toyama: {
    gov: {
      patients: 'http://www.pref.toyama.jp/cms_sec/1205/kj00021798.html',
      summary: 'http://www.pref.toyama.jp/cms_sec/1205/kj00021798.html'
    },
    summary: {
      format: 'html',
      encoding: 'SJIS',
      url: 'http://www.pref.toyama.jp/cms_sec/1205/kj00021798.html',
      extract: html.toyamaSummaryExtract
    },
    latest: {
      format: 'html',
      encoding: 'SJIS',
      url: 'http://www.pref.toyama.jp/cms_sec/1205/kj00021798.html',
      extract: html.toyamaLatestExtract
    },
    cities: {
      toyamaCity: {
        gov: {
          patients: 'https://www.city.toyama.toyama.jp/fukushihokenbu/hokensho/hokenyoboka/shingatakorona_3.html'
        }
      }
    },
  },
  wakayama: {
    gov: {
      patients: 'https://www.pref.wakayama.lg.jp/prefg/041200/d00203387.html',
      summary: 'https://www.pref.wakayama.lg.jp/prefg/041200/d00203387.html'
    },
    summary: {
      format: 'html',
      url: 'https://www.pref.wakayama.lg.jp/prefg/041200/d00203387.html',
      extract: html.wakayamaSummaryExtract
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.wakayama.lg.jp/prefg/041200/d00203387.html',
      extract: html.wakayamaLatestExtract
    },
    dashboard: 'https://stopcovid19.wakayama.jp/'
  },
  yamagata: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/yamaserif/covid19/development/data/data.json',
    },
    summary: {
      format: 'html',
      url: 'http://www.pref.yamagata.jp/kenfuku/kenko/kansen/720130425shingata_corona.html',
      extract: html.yamagataSummaryExtract
    },
    gov: {
      patients: 'http://www.pref.yamagata.jp/kenfuku/kenko/kansen/720130425shingata_corona.html',
      summary: 'http://www.pref.yamagata.jp/kenfuku/kenko/kansen/720130425shingata_corona.html'      
    },
    cities: {
      yonezawa: {
        gov: { patients: 'http://www.city.yonezawa.yamagata.jp/item/8355.html#itemid8355' }
      }
    },
    source: 'https://github.com/yamaserif/covid19',
    dashboard: 'https://stopcovid19-yamagata.netlify.app/'
  },
  yamaguchi: {
    summary: {
      format: 'html',
      url: 'https://www.pref.yamaguchi.lg.jp/cms/a10000/korona2020/202004240002.html',
      extract: html.yamaguchiSummaryExtract
    },
    gov: {
      patients: 'https://www.pref.yamaguchi.lg.jp/cms/a10000/korona2020/202004240002.html',
      summary: 'https://www.pref.yamaguchi.lg.jp/cms/a10000/korona2020/202004240002.html'
    },
    source: 'https://github.com/nishidayoshikatsu/covid19-yamaguchi/'
  },
  yamanashi: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/covid19-yamanashi/covid19/development/data/data.json'
    },
    latest: {
      format: 'html',
      url: 'https://www.pref.yamanashi.jp/koucho/coronavirus/info_coronavirus_prevention.html',
      extract: html.yamanashiLatestExtract
    },
    gov: {
      patients: 'https://www.pref.yamanashi.jp/koucho/coronavirus/info_coronavirus_prevention.html'
    },
    source: 'https://github.com/covid19-yamanashi/covid19',
    dashboard: 'https://stopcovid19.yamanashi.dev/'
  }
}