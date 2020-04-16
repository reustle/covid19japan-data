const sources = {
  tokyo: {
    patients: { 
      format: 'csv',
      url: 'https://stopcovid19.metro.tokyo.lg.jp/data/130001_tokyo_covid19_patients.csv'
    }
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
    }
  },
  kanagawa: {
    patients: {
      format: 'csv',
      encoding: 'SJIS',
      url: 'http://www.pref.kanagawa.jp/osirase/1369/data/csv/patient.csv'
    }
  }
}

exports.sources = sources