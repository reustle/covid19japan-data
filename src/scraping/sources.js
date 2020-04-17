const sources = {
  akita: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/asaba-zauberer/covid19-akita/development/data/data.json',
    },
    source: 'https://github.com/asaba-zauberer/covid19-akita/tree/development/data',
    dashboard: 'https://covid19-akita.netlify.app/en'
  },
  aomori: {
    patients: {
      format: 'csv',
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
      url: '',
    },
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
      url: 'https://www.harp.lg.jp/opendata/dataset/1369/resource/2828/patients.csv'
    },
    source: [ 'https://www.harp.lg.jp/opendata/dataset/1369.html' ],
    dashboard: 'https://stopcovid19.hokkaido.dev/'
  },
  hyogo: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/stop-covid19-hyogo/covid19/development/data/patients.json'
    },
    source: 'https://github.com/stop-covid19-hyogo/covid19',
    dashboard: 'https://stop-covid19-hyogo.org/'
  },
  ibaraki: {
    patients: {
      format: 'json',
      url: 'https://raw.githubusercontent.com/a01sa01to/covid19-ibaraki/development/data/data.json'
    },
    source: 'https://github.com/a01sa01to/covid19-ibaraki/tree/development/data',
    dashboard: 'https://ibaraki.stopcovid19.jp/'
  },
  ishikawa: {},
  kagawa: {
    patients: {
      format: 'json',
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
  osaka: {
    patients: {
      format: 'json', 
      url: 'https://raw.githubusercontent.com/codeforosaka/covid19/development/data/data.json'
    },
    source: 'https://github.com/codeforosaka/covid19',
    dashboard: 'https://covid19-osaka.info/'
  },
  shiga: {
    patients: {

    },
    source: 'https://github.com/shiga-pref-org/covid19',
    dashboard: 'https://stopcovid19.pref.shiga.jp/',
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
  tokyo: {
    patients: { 
      format: 'csv',
      url: 'https://stopcovid19.metro.tokyo.lg.jp/data/130001_tokyo_covid19_patients.csv'
    },
    info: []
  },
}

exports.sources = sources