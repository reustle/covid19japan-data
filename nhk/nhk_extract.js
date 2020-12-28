// Script to extract aggregate values from NHK and write them into 
// the Google Spreadsheet using the account that exists in
// credentials.json in the root directory of this checkout.
//
// These credentials are a service account that is generated using
// these instructions:
//
// https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account

const fetch = require('node-fetch')
const path = require('path')
const process = require('process')

const { GoogleSpreadsheet } = require('google-spreadsheet')
const { program } = require('commander')
const { DateTime, Interval } = require('luxon')
const { extractDailySummary, sortedPrefectureCounts, latestNhkArticles, prefectureLookup } = require('../src/statusboard/nhk.js')

const SPREADSHEET_ID = '1vkw_Lku7F_F3F_iNmFFrDq9j7-tQ6EmZPOLpLt-s3TY';
const CREDENTIALS_PATH =  path.join(__dirname, '../credentials.json');
const NHKNEWS_BASE_URL = 'https://www3.nhk.or.jp';

// test sheet
//const SPREADSHEET_ID = '1hVMsINcHicoq-Ed68_puYlInLusnweniqG3As-lSF_o';

const insertColumn = async (sheet, columnIndex) => {
  await sheet._makeSingleUpdateRequest('insertRange', 
  {
    range: {
      sheetId: sheet.sheetId, 
      startColumnIndex: columnIndex, 
      endColumnIndex: columnIndex + 1
    },
    shiftDimension: 'COLUMNS'
  })
}

const copyPasteColumn = async(sheet, fromColumnIndex, toColumnIndex) => {
  await sheet._makeSingleUpdateRequest('copyPaste', 
  {
    source: {
      sheetId: sheet.sheetId, 
      startColumnIndex: fromColumnIndex, 
      endColumnIndex: fromColumnIndex + 1
    },
    destination: {
      sheetId: sheet.sheetId, 
      startColumnIndex: toColumnIndex, 
      endColumnIndex: toColumnIndex + 1      
    },
    pasteType: 'PASTE_NORMAL',
    pasteOrientation: 'NORMAL'
  })  
}

const googleCredentials = () => {
  if (process.env.GOOGLE_ACCOUNT_CREDENTIALS_JSON)  {
    return JSON.parse(process.env.GOOGLE_ACCOUNT_CREDENTIALS_JSON)
  } else {
    return require(CREDENTIALS_PATH)
  }
}

const writeNhkSummary = async (credentialsJson, dateString, url, prefectureCounts, otherCounts) => {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
  await doc.useServiceAccountAuth(credentialsJson)
  await doc.loadInfo(); // loads document properties and worksheets

  const nhkSheet = doc.sheetsByTitle['NHK']
  await nhkSheet.loadCells('H1:H59')
  await nhkSheet.loadCells('A2')

  let dateCell = nhkSheet.getCellByA1('H1')
  let linkCell = nhkSheet.getCellByA1('H2')

  const mysteriousDayOffset = 2 // dunno why 2 days are missing between 1900-1970
  let sheetsStartDate = DateTime.fromISO('1900-01-01')
  let newCellDate = DateTime.fromISO(dateString)
  let interval = Interval.fromDateTimes(sheetsStartDate, newCellDate)
  // console.log('Current Value', dateCell.formattedValue, dateCell.value)
  // console.log('Calculated Value', cellDate.toISODate())
  // console.log(interval.length('days') + 2)
  let dateValue = mysteriousDayOffset + interval.length('days')
  if (dateValue > dateCell.value) {
    // If the date to write it larger than the current value,
    // insert column and copy old values to the new column.
    await insertColumn(nhkSheet, 8)
    await copyPasteColumn(nhkSheet, 7, 8)
  }


  // Load cells again in case we inserted a new column.
  await nhkSheet.loadCells('H1:H59')
  dateCell = nhkSheet.getCellByA1('H1')
  linkCell = nhkSheet.getCellByA1('H2')

  dateCell.value = dateValue
  linkCell.formula = `=HYPERLINK("${url}", "Link")`

  for (let i = 0; i < prefectureCounts.length; i++) {
    let cell = nhkSheet.getCell(3 + i, 7)
    cell.value = prefectureCounts[i]
  }
  
  for (let i = 0; i < otherCounts.length; i++) {
    let cell = nhkSheet.getCell(50 + i, 7)
    cell.value = otherCounts[i]
  }

  // Write the current date in to the A2 cell.
  todayCell = nhkSheet.getCellByA1('A2')
  todayCell.value = dateValue

  await nhkSheet.saveUpdatedCells()
}

const extractAndWriteSummary = (date, url, shouldWrite) => {
  console.log(url)
  extractDailySummary(url, fetch)
  .then(values => {
    let prefectureCounts = sortedPrefectureCounts(values)
    let otherCounts = [
      values.portQuarantineCount,
      values.critical,
      values.deceased,
      values.recoveredJapan,
      values.recoveredTotal
    ]

    // Abort if any of the numbers look weird
    let errors = ''
    for (let count of otherCounts) {
      if (!count) {
        errors = 'otherCounts has 0s'
      }
    }
    if (prefectureCounts.length < 47) {
      errors ='prefectureCounts are less than 47'
    }
    for (let count of prefectureCounts) {
      if (!count) {
        errors = 'prefectureCounts has 0s'
      }
    }

    if (!errors && shouldWrite) {
      writeNhkSummary(googleCredentials(), date, url, prefectureCounts, otherCounts)
    } else {
      console.log(prefectureCounts)
      console.log(otherCounts)
      if (errors) {
        console.log(errors)
      }
    }
  })
}

const main = async () => {
  // let url = 'https://www3.nhk.or.jp/news/html/20200411/k10012381781000.html?utm_int=detail_contents_news-related_002'
  // if (process.argv[2]) {
  //   url = process.argv[2]
  //   console.log(url)
  // }

  program.version('0.0.1')
  program
    .option('-d, --date <date>', 'Date in YYYY-MM-DD format')
    .option('--url <url>', 'URL of NHK Report (e.g. https://www3.nhk.or.jp/news/html/20201219/k10012773101000.html)')
    .option('-w, --write', 'Write to spreadsheet')
    .option('-l, --list', 'List all articles')
    .option('--today', 'Execute for today.')
    .option('--yesterday', 'Execute for yesterday.')
  program.parse(process.argv)

  if (!program.date  && !program.list && !(program.today || program.yesterday)) {
    program.help()
    return
  }

  if (program.today) {
    program.date = DateTime.utc().plus({hours: 9}).toISODate()
  }

  if (program.yesterday) {
    program.date = DateTime.utc().plus({hours: 9}).minus({days: 1}).toISODate()
  }

  if (program.list) {
    latestNhkArticles(fetch, 5).then(articles => {
      for (let article of articles) {
        let date = DateTime.fromJSDate(new Date(article.pubDate)).toISODate()
        let url = NHKNEWS_BASE_URL + article.link
        console.log(date, article.title, url)
      }
    })
  } else  if (!program.url) {
    let matchDate = DateTime.fromISO(program.date).toFormat('yyyyMMdd')
    console.log(matchDate)
    latestNhkArticles(fetch, 5).then(articles => {
      let summaryArticleUrl = ''
      const summaryArticleTitlePattern = new RegExp('(【国内感染】|【国内】)')
      for (let article of articles) {
        if (article.link.match('/' + matchDate + '/') && article.title.match(summaryArticleTitlePattern)) { 
          summaryArticleUrl = NHKNEWS_BASE_URL + article.link
        }
      }

      if (summaryArticleUrl) {
        extractAndWriteSummary(program.date, summaryArticleUrl, program.write)
      } else {
        console.error('Not able to find articles')
        for (let article of articles) {
          let date = DateTime.fromJSDate(new Date(article.pubDate)).toISODate()
          console.log(date, article.title, article.link)
        }
        return
      }
    })
  } else {
    extractAndWriteSummary(program.date, program.url, program.write)
  }
}

main()

