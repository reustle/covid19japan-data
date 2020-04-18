// List of third-party machine readable data sources by prefectures. 

const sources = {
  aichi: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/code4nagoya/covid19/development/data/data.json'
    },
    source: 'https://github.com/code4nagoya/covid19',
    dashboard: 'https://stopcovid19.code4.nagoya/'
  },
  akita: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/asaba-zauberer/covid19-akita/development/data/data.json',
      key: 'patients.data'
    },
    source: 'https://github.com/asaba-zauberer/covid19-akita/tree/development/data',
    dashboard: 'https://covid19-akita.netlify.app/en'
  },
  aomori: {
    patients: {
      format: 'csv',
      encoding: 'SJIS',
      url: 'https://opendata.pref.aomori.lg.jp/dataset/1531/resource/11178/20200411_%E9%99%BD%E6%80%A7%E6%82%A3%E8%80%85%E9%96%A2%E4%BF%82.csv',
    },
    tests: {
      format: 'csv',
      url: 'https://opendata.pref.aomori.lg.jp/dataset/1531.html'
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
    source: 'https://github.com/civictechzenchiba/covid19-chiba',
    dashboard: 'https://covid19.civictech.chiba.jp/'
  },
  ehime: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/ehime-covid19/covid19/master/data/data.json',
    },
    source: 'https://github.com/ehime-covid19/covid19',
    dashboard: 'https://ehime-covid19.com/'
  },

 
  fukui: {
    patients: {
      format: 'csv',
      url: 'https://www.pref.fukui.lg.jp/doc/toukei-jouhou/covid-19_d/fil/covid19_patients.csv'
    },
    tests: {
      format: 'csv',
      url: 'https://www.pref.fukui.lg.jp/doc/toukei-jouhou/covid-19_d/fil/covid19_test_count.csv'
    }
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
    source: 'https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_patients',
    dashboard: 'https://fukuoka.stopcovid19.jp/',
  },
  gifu: {
    patients: {
      format: 'sheets',
      url: 'https://docs.google.com/spreadsheets/d/15CHGPTLs5aqHXq38S1RbrcTtaaOWDDosfLqvey7nh8k/edit'
    },
    source: 'https://github.com/CODE-for-GIFU/covid19/blob/development/api/sheet.js',
    dashboard: 'https://covid19-gifu.netlify.app/',
  },
  gunma: {
  },
  hiroshima: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/tatsuya1970/covid19/development/data/data.json',
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
    source: [ 'https://www.harp.lg.jp/opendata/dataset/1369.html' ],
    dashboard: 'https://stopcovid19.hokkaido.dev/'
  },
  hyogo: {
    patients: {
      format: 'json',
      key: 'data',
      url: 'https://raw.githubusercontent.com/stop-covid19-hyogo/covid19/development/data/patients.json'
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
    source: 'https://github.com/a01sa01to/covid19-ibaraki/tree/development/data',
    dashboard: 'https://ibaraki.stopcovid19.jp/'
  },
  ishikawa: {},
  kagawa: {
    patients: {
      format: 'json',
      key: 'data',
      url: 'https://raw.githubusercontent.com/codeforkagawa/covid19/development/data/patients.json'
    },
    source: 'https://github.com/codeforkagawa/covid19',
    dashboard: 'https://kagawa.stopcovid19.jp/en'
  },
  kagoshima: {
    dashboard: 'https://covid19.code4kagoshima.org/en',
  },
  kochi: {},
  kanagawa: {
    patients: {
      format: 'csv',
      encoding: 'SJIS',
      url: 'http://www.pref.kanagawa.jp/osirase/1369/data/csv/patient.csv'
    }
  },
  kumamoto: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/codeforkumamoto/covid19/development/data/data.json',
    },
    source: 'https://github.com/codeforkumamoto/covid19',
    dashboard: 'https://kumamoto.stopcovid19.jp/',
  },
  kyoto: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/stopcovid19-kyoto/covid19/development/data/data.json'
    },
    source: 'https://github.com/stopcovid19-kyoto/covid19',
    dashboard: 'https://stopcovid19-kyoto.netlify.app/',
  },
  mie: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/FlexiblePrintedCircuits/covid19-mie/develop/data/data.json'
    },
    source: 'https://github.com/FlexiblePrintedCircuits/covid19-mie',
    dashboard: 'https://mie.stopcovid19.jp/',
  },
  miyagi: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/code4shiogama/covid19-miyagi/development/data/data.json'
    },
    source: 'https://github.com/code4shiogama/covid19-miyagi/tree/development/data',
  },
  miyazaki: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/covid19-miyazaki/covid19/development/data/data.json'
    },
    source: 'https://github.com/covid19-miyazaki/covid19'
  },
  nagano: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/kanai3id/covid19/development/data/data.json',
    },
    source: 'https://github.com/kanai3id/covid19',
    dashboard: 'https://covid19-nagano.info/en'
  },
  nagasaki: {
 
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
    source: 'https://github.com/code4nara/covid19',
    dashboard: 'https://stopcovid19.code4nara.org/'
  },
  niigata: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/CodeForNiigata/covid19/development/data/data.json',
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
    source: 'http://www.okayama-opendata.jp/opendata/ga120PreAction.action?keyTitle=d9c4776db7f09fff161953a2aaf03b80a9abad48&datasetId=e6b3c1d2-2f1f-4735-b36e-e45d36d94761',
    dashboard: 'https://okayama.stopcovid19.jp/'
  },
  okinawa: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/Code-for-OKINAWA/covid19/development/data/data.json'
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
    source: 'https://github.com/codeforosaka/covid19',
    dashboard: 'https://covid19-osaka.info/'
  },
  saga: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/codeforsaga/covid19/development/data/data.json'
    },
    source: 'https://github.com/codeforsaga/covid19/tree/development/data',
    dashboard: 'https://stopcovid19.code4saga.org/en'
  },
  saitama: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/codefortoda/covid19-saitama/development/data/data.json'
    },
    source: 'https://opendata.pref.saitama.lg.jp/data/dataset/covid19-jokyo',
    dashboard: 'https://saitama.stopcovid19.jp/'
  },
  shiga: {
    source: 'https://github.com/shiga-pref-org/covid19',
    dashboard: 'https://stopcovid19.pref.shiga.jp/',
  },
  shimane: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/TaigaMikami/shimane-covid19/shimane/data/data.json'
    },
    source: 'https://github.com/TaigaMikami/shimane-covid19/',
    dashboard: 'https://shimane-covid19.netlify.app/en'
  },
  shizuoka: {
    hanamatsu: {
      patients: {
        url: 'https://opendata.pref.shizuoka.jp/dataset/8113/resource/44704/221309_hamamatsu_covid19_patients.csv'
      },
      source: 'https://opendata.pref.shizuoka.jp/dataset/8113.html',
      dashboard: 'https://stopcovid19-hamamatsu.netlify.app/en'
    },
  },
  tochigi: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/covid19-tochigi/covid19/development/data/data.json'
    },
    sheet: 'https://docs.google.com/spreadsheets/d/1aCIRyol3UncEtstWhT_Yw3I8mCbvpGQU5_HUKB_0JFA/edit#gid=0',
    source: 'https://github.com/covid19-tochigi/covid19',
    dashboard: 'https://covid19-tochigi.netlify.app/'
  },
  tokushima: {

  },
  tottori: {
    dashboard: 'https://tottori-covid19.netlify.app/en'
  },
  toyama: {},
  tokyo: {
    patients: { 
      format: 'csv',
      url: 'https://stopcovid19.metro.tokyo.lg.jp/data/130001_tokyo_covid19_patients.csv'
    },
    dashboard: ''
  },
  yamagata: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/yamaserif/covid19/development/data/data.json',
    },
    source: 'https://github.com/yamaserif/covid19',
    dashboard: 'https://stopcovid19-yamagata.netlify.app/'
  },
  yamaguchi: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/nishidayoshikatsu/covid19-yamaguchi/development/data/data.json'
    },
    source: 'https://github.com/nishidayoshikatsu/covid19-yamaguchi/'
  },
  yamanashi: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/covid19-yamanashi/covid19/development/data/data.json'
    },
    source: 'https://github.com/covid19-yamanashi/covid19',
    dashboard: 'https://stopcovid19.yamanashi.dev/'
  }
}

exports.sources = sources