import { normalizeFixedWidthNumbers } from './translation.js'

const resultForimageWithAlt = ($, url, alt) => {
  const summaryImage = $('img').filter((i, v) => {
    if ($(v).attr('alt').match(alt)) {
      return true
    }
  })
  if (summaryImage.length < 1) {
    return {}
  }
  return {image: absoluteURL(url, summaryImage.attr('src'))}
}

const absoluteURL = (baseURL, path) => {
  const baseURLURL = new URL(baseURL)
  let newPath = path
  if (!newPath.startsWith('/')) {
    let originalPath = baseURLURL.pathname
    let components = originalPath.split('/')
    newPath = components.slice(0, components.length - 1).join('/') + '/' + path
  }
  return `${baseURLURL.protocol}//${baseURLURL.host}${newPath}`

}

export const aichiLatestExtract = ($) => {
  let patientNews = $('.detail_free p').first()
  return {
    latest: patientNews.text()
  }
}

export const aichiNagoyaLatestExtract = ($) => {
  let patientNews = $('.mol_attachfileblock ul li').first()
  return {
    latest: patientNews.text()
  }
}

export const aichiOkazakiiLatestExtract = ($) => {
  let patientNews = $('.article').children('p').first()
  return {
    latest: patientNews.text()
  }
}

export const aichiToyohashiLatestExtract = ($) => {
  let patientNews = $('#ContentPane h5').first()
  return {
    latest: patientNews.text().match('([0-9０-９月日]+発表)')[1]
  }
}

export const aomoriSummaryExtract = ($) => {
  let hospitalized = $('h2').filter((i, v) => {
    return $(v).text().match('感染者の入院の状況')
  })
  
  let hospitalizedText = hospitalized.first().next().text()
  let hospitalizedPattern = new RegExp('までの感染者数は([0-9]+)名であり、新型コロナウイルス感染症患者として現在入院されている方は([0-9]+)名です。')
  let hospitalizedMatch = hospitalizedText.match(hospitalizedPattern)
  if (hospitalizedMatch) {
    let recovered = parseInt(hospitalizedMatch[1]) - parseInt(hospitalizedMatch[2])
    return {
      recovered: recovered,
      confirmed: parseInt(hospitalizedMatch[1])
    }
  }
  return {}
}

export const akitaSummaryExtract = ($) => {
  let cells = $('table.c-table--full').eq(1).find('td')
  return {
    confirmed: cells.eq(0).text(),
    deceased: cells.eq(3).text(),
    recovered: cells.eq(4).text()
  }
}


export const chibaSummaryExtract = ($) => {
  let result = {}

  // const lastUpdatePattern = new RegExp('令和[0-9]+年([0-9]+)月([0-9]+)日現在', 'gi')
  // let lastUpdateText = $('#tmp_contents h2').text()
  // if (lastUpdateText) {
  //   let lastUpdate = [...lastUpdateText.matchAll(lastUpdatePattern)]
  //   if (lastUpdate) {
  //     result['lastUpdate'] = `2020-${lastUpdate[0][1]}-${lastUpdate[0][2]}`
  //   }
  // }

  const cells = $('table').first().find('tr:nth-child(2) td')
  result.confirmed = cells.eq(0).text()
  result.active = cells.eq(1).text()
  result.recovered = cells.eq(2).text()
  result.deceased = cells.eq(3).text()

  result.tested = $('table').eq(2).find('tr:nth-child(2) td').first().text()

  return result
}

export const chibaLatestExtract = ($) => {
  let patientNews = $('.datatable tr').filter((i, v) => {
    return $(v).text().match('検査確定日：')
  })
  return {
    latest: patientNews.first().text()
  }
}

export const chigasakiLatestExtract = ($) => {
  const latestText = $('h3').first().text()
  return {
    latest: latestText
  }
}

export const fujisawaLatestExtract = ($) => {
  const latestText = $('h4').first().text()
  return {
    latest: latestText
  }
}


export const fukuiSummaryExtract = ($) => {
  let tables = $('table')
  let deceasedCell = tables.eq(1).find('tr:nth-child(2) td:nth-child(2)')
  let recoveredCell = tables.eq(1).find('tr:nth-child(5) td:nth-child(2)')
  let confirmedCell = tables.eq(3).find('tr').last().find('td:nth-child(4)')
  let pageInfo = $('#page-information .date').text()
  let result = {
    deceased:  normalizeFixedWidthNumbers(deceasedCell.text()),
    recovered:  normalizeFixedWidthNumbers(recoveredCell.text()),
    confirmed: normalizeFixedWidthNumbers(confirmedCell.text()),
    lastUpdated: pageInfo
  }
  return result
}


export const fukuokaSummaryExtract = ($, url) => {
  return resultForimageWithAlt($, url, '感染者数と退院者数')
}

export const fukuokaLatestExtract = ($) => {
  let titles = $('h2').first()
  return {
    latest: titles.text()
  }
}

export const gifuSummaryExtract = ($, url) => {
  const summaryImage = $('img').filter((i, v) => {
    let title = $(v).attr('title')
    if (title && title.match('県内の発生状況')) {
      return true
    }
  })

  if (summaryImage.length < 1) {
    return {}
  }
  return { image: absoluteURL(url, summaryImage.attr('src')) }
}

export const gunmaSummaryExtract = ($, url) => {
  const pdfLink = $('div.honbun a').first().attr('href')
  return {
    image: absoluteURL(url, pdfLink)
  }
}

export const hiroshimaSummaryExtract = ($) => {
  const datePattern = new RegExp('([0-9]+)月([0-9]+)日現在')
  let summaryTable = $('table')[0]
  let summaryCells = $(summaryTable).find('td')
  let lastUpdated = $('h3').first().text().match(datePattern)[0]
  return {
    lastUpdated: lastUpdated,
    confirmed: $(summaryCells[4]).text(),
    recovered: $(summaryCells[6]).text(),
    deceased: $(summaryCells[7]).text()
  }

}

export const hiroshimaLatestExtract = ($) => {
  let tables = $('table').filter((i, v) => {
    let header = $($(v).prev())
    if (header.text().match('新型コロナウイルス感染症患者の概要については，以下のとおりです。')) {
      return true
    }
    return false
  })

  if (tables.length < 1) {
    return {}
  }
  let latestRowCells = tables.eq(0).find('tr').eq(1).find('td')
  let latestInfo = $(latestRowCells[1]).text() + ' ' + $(latestRowCells[0]).text() 
  return {
    latest: latestInfo
  }
}



export const hokkaidoSummaryExtract = ($, url) => {
  const summaryHeader = $('.submenu-main h2').eq(2)
  let nextP = summaryHeader.next()
  let nextA = nextP.find('a')

  const path = nextA.attr('href')
  return {
    image: absoluteURL(url, path)
  }
}

export const hokkaidoLatestExtract = ($) => {
  let patientNewsDate = $('h3').first()
  return {
    latest: patientNewsDate.text()
  }
}

export const hyogoSummaryExtract = ($) => {
  const table = $('.ex_table')
  const lastUpdated = table.prev().text()
  const rows = table.find('tr')
  const cells = $(rows[3]).find('td')
  return {
    lastUpdated: lastUpdated,
    tested: $(cells[0]).text(),
    confirmed: $(cells[1]).text(),
    deceased: $(cells[5]).text(),
    recovered: $(cells[6]).text(),
  }
}

export const hyogoLatestExtract = ($) => {
  let patientNewsDate = $('h3').first()
  return {
    latest: patientNewsDate.text()
  }
}


export const ibarakiLatestExtract = ($) => {
  let patientNewsDate = $('.tmp_contents h4').first()
  return {
    latest: patientNewsDate.text()
  }
}


export const ibarakiSummaryExtract = ($, url) => {
  return resultForimageWithAlt($, url, '陽性者の状況')
}

export const ishikawaSummaryExtract = ($) => {
  const totalRow = $('table tbody tr').last()
  const cells = $(totalRow).find('td')
  return {
    confirmed: $(cells[1]).text(),
    recovered: $(cells[2]).text(),
    deceased: $(cells[3]).text()
  }
}

export const kagawaSummaryExtract = ($, url) => {
  return resultForimageWithAlt($, url, '患者の状況')
}

export const kanagawaSummaryExtract = ($, url) => {
  const confirmedCell = $('table').first().find('tbody tr').eq(0).find('td').eq(1)
  const recoveredCell = $('table').first().find('tbody tr').eq(11).find('td').eq(1)
  const deceasedCell = $('table').first().find('tbody tr').eq(12).find('td').eq(1)
  return {
    confirmed: confirmedCell.text(),
    recovered: recoveredCell.text(),
    deceased: deceasedCell.text()
  }
}

export const kanagawaLatestExtract = ($) => {
  let patientNews = $('h3').filter((i, v) => { return $(v).text().match('患者の概要')})
  let latestText = patientNews.first().text()
  if (latestText) {
    let date = patientNews.first().next('p').text().split('、')[0]
    latestText = date + ' ' + latestText
  }
  return {
    latest: latestText
  }
}

export const kawasakiLatestExtract = ($) => {
  const latestText = $('h2').first().text()
  return {
    latest: latestText
  }
}

export const kochiSummaryExtract = ($, url) => {
  return {
    image: absoluteURL(url, $('div.body a.iconPdf').first().attr('href'))
  }
}

export const kyotoSummaryExtract = ($, url) => {
  return resultForimageWithAlt($, url, new RegExp('.*pcr'))
}

export const kyotoLatestExtract = ($) => {
  let latestTableRow = $('table.datatable')[1]
  let cells = $(latestTableRow).find('td')
  let latestInfo = $(cells[1]).text() + ' ' + $(cells[0]).text() 
  return {
    latest: latestInfo
  }
}

export const kyotoCityLatestExtract = ($) => {
  let patientNews = $('.mol_contents h3')[1]
  return {
    latest: $(patientNews).text()
  }
}

export const mieSummaryExtract = ($, url) => {
  const lastRow = $('table').eq(2).find('tr').last()
  const secondLastRow = $('table').eq(1).find('tr').eq(1)
  const extractNumber = (t) => {
    let num =  t.match(new RegExp('([０-９0-9]+)', 'm'))
    if (num) {
      return normalizeFixedWidthNumbers(num[1])
    }
    return ''
  }
  return {
    tested: extractNumber(lastRow.find('td').eq(0).text()),
    confirmed: extractNumber(lastRow.find('td').eq(1).text()),
    deceased: extractNumber(secondLastRow.find('td').eq(4).text()),
    recovered: extractNumber(secondLastRow.find('td').eq(5).text())
  }
}


export const miyagiSummaryExtract = ($, url) => {
  return resultForimageWithAlt($, url, new RegExp('(現在)'))
}


export const naganoSummaryExtract = ($, url) => {
  return resultForimageWithAlt($, url, '(陽性|感染者)')
}


export const naraSummaryExtract = ($, url) => {
  const numberRow = $('table.smartoff').first().find('table:first-child table').find('tr').eq(4)

  return {
    confirmed: numberRow.find('td').eq(0).text(),
    deceased: numberRow.find('td').eq(5).text(),
    recovered: numberRow.find('td').eq(6).text(),
  }
}


export const niigataSummaryExtract = ($, url) => {
  const numberRow = $('table').first().find('tbody tr').first()

  return {
    tested: numberRow.find('td').eq(0).text(),
    confirmed: numberRow.find('td').eq(1).text(),
    recovered: numberRow.find('td').eq(5).text(),
  }
}


export const niigataLatestExtract = ($, url) => {
  const latestRow = $('table').eq(1).find('tbody tr').first()
  return {
    latest: latestRow.find('td').eq(2).text() + ' ' + latestRow.find('td').eq(1).text()
  }
}

export const oitaSummaryExtract = ($, url) => {
  const summary = $('.detail_free p').first()
  console.log(summary)
  const pattern = new RegExp('これまでに延べ([0-9,]+)人実施し、陰性([0-9,]+)人、陽性([0-9,]+)人（うち退院([0-9,]+)名、死亡([0-9,]+)名）')
  let match = summary.text().match(pattern)
  if (match) {
    return {
      tested: match[1],
      confirmed: match[3],
      recovered: match[4],
      deceased: match[5]
    }
  }
  return {}
}

export const oitaLatestExtract = ($, url) => {
  const summary = $('.detail_free p').eq(1)
  return {
    latest: summary.text()
  }
}

export const okayamaSummaryExtract = ($, url) => {
  const summaryText = $('#main_body p').eq(2).text()
  const summaryPattern = new RegExp('岡山県内の感染者数 ([０-９]+) 人 \（うち退院 ([０-９]+) 人\）')
  const summaryMatch = summaryText.match(summaryPattern)
  if (summaryMatch) {
    return {
      confirmed: normalizeFixedWidthNumbers(summaryMatch[1]),
      recovered: normalizeFixedWidthNumbers(summaryMatch[2])
    }
  }
  return {}
}


export const okinawaSummaryExtract = ($, url) => {
  const pdfLink = $('a.icon_pdf').first().attr('href')
  if (pdfLink) {
    return {
      image: absoluteURL(url, pdfLink)
    }
  }
  return {}
}



export const osakaSummaryExtract = ($, url) => {
  return resultForimageWithAlt($, url, '発生状況')
}


export const osakaLatestExtract = ($) => {
  let patientNews = $('.box_list tr').filter((i, v) => {
    return $(v).text().match('新型コロナウイルス感染症患者の発生')
  })
  return {
    latest: patientNews.first().text()
  }
}


export const sagaSummaryExtract = ($, url) => {
  const confirmedText = $('table').first().find('tbody tr').first().find('th').eq(1).text()
  const confirmedPattern = /^[\s]*([0-9]+)/
  const recoveredText = $('table').first().find('tbody tr').eq(5).find('td').eq(1).text()
  const deceasedText = $('table').first().find('tbody tr').eq(6).find('td').eq(1).text()

  return {
    confirmed: confirmedText.match(confirmedPattern)[1],
    recovered: recoveredText,
    deceased: deceasedText
  }
}


export const saitamaSummaryExtract = ($) => {
  const confirmedPattern = new RegExp('県内の陽性確認者数：([0-9]+)人')
  const recoveredPattern = new RegExp('退院・療養終了：([0-9]+)人')
  const deceasedPattern = new RegExp('死亡：([0-9]+)人')

  
  let totalConfirmed = 0
  let totalRecovered = 0
  let totalDeceased = 0
  $('.outline_type1 li').each((i, v) => {
    let text =  $(v).text()
    console.log(text)
    let confirmedResult = text.match(confirmedPattern)
    if (confirmedResult) { totalConfirmed = confirmedResult[1] }

    let recoveredResult = text.match(recoveredPattern)
    if (recoveredResult) { totalRecovered = recoveredResult[1] }

    let deceasedResult =text.match(deceasedPattern)
    if (deceasedResult) { totalDeceased = deceasedResult[1] }
  })

  return {
    confirmed: totalConfirmed,
    recovered: totalRecovered,
    deceased: totalDeceased,
    lastUpdated: $('tmp_update').text()
  }
}

export const saitamaLatestExtract = ($) => {
  let patientNews = $('.box_news li').filter((i, v) => {
    return $(v).text().match('発生について')
  })
  return {
    latest: patientNews.first().text()
  }
}


export const sagamiharaLatestExtract = ($) => {
  const latestText = $('h2').first().text()
  return {
    latest: latestText
  }
}


export const shigaSummaryExtract = ($) => {
  const row = $('div.table table').eq(1).find('tr').last()
  return {
    tested: row.find('td').eq(0).text(),
    confirmed: row.find('td').eq(1).text(),
    recovered: row.find('td').eq(6).text(),
    deceased: row.find('td').eq(7).text()
  }
}

export const shimaneSummaryExtract = ($) => {
  const p = $('#page-content p').eq(3).text()
  const pattern = new RegExp('島根県内で、(.*)現在、新型コロナウイルス感染者が([0-9]+)名確認されています。\（うち([0-9]+)名が回復し退院しています。\）')
  const match = p.match(pattern)
  if (match) {
    return {
      confirmed: match[2],
      recovered: match[3]
    }
  }
  return {}
}

export const shizuokaSummaryExtract = ($, url) => {
  return resultForimageWithAlt($, url, 'kennnai_youseisyasuujoukyou')
}

export const toyamaSummaryExtract = ($, url) => {
  const summary = $('#contents #main p').first().text()
  const pattern = new RegExp('([0-9]+)例\（入院中又は入院等調整中([0-9]+)例、退院([0-9]+)例、死亡([0-9]+)例')
  const match = summary.match(pattern)
  if (match) {
    return {
      confirmed: match[1],
      recovered: match[3],
      deceased: match[4]
    }
  }
  return {}
}


export const toyamaLatestExtract = ($, url) => {
  const summary = $('#file li').last().text()
  return { latest: summary }
}

export const wakayamaSummaryExtract = ($, url) => {
  const summary = $('#content a').first()
  return { image: absoluteURL(url, summary.attr('href'))}
}

export const wakayamaLatestExtract = ($, url) => {
  const summary = $('#content a').first()
  return { latest: summary.text() }
}

export const yamagataSummaryExtract = ($, url) => {
  return resultForimageWithAlt($, url, '感染者数グラフ')
}

export const yamaguchiSummaryExtract = ($, url) => {
  const summary = $('table').eq(1).find('p').eq(1).text()
  const pattern = new RegExp('山口県の感染者数：　([0-9]+)人.*入院等：([0-9]+)人／退院：([0-9]+)人')
  const match = summary.match(pattern)
  if (match) {
    return {
      confirmed: match[1],
      recovered: match[3]
    }
  }
  return {}
}

export const yamanashiLatestExtract = ($, url) => {
  const latestRow = $('table').first().find('a.icon_pdf').first()
  return { latest: latestRow.text() }
}

export const yokohamaLatestExtract = ($) => {
  const header = $('.contents-area .wysiwyg_wp').first().text()
  const datePattern = new RegExp('[0-9]+月[0-9]+日[0-9]+時')
  return {
    latest: header.match(datePattern)[0]
  }
}

export const yokohamaSummaryExtract = ($) => {
  const tableCells = $('table.table01 td')
  return {
    lastUpdated: $('h2').first().text(),
    confirmed: $(tableCells[0]).text(),
    deceased: $(tableCells[6]).text(),
    recovered: $(tableCells[7]).text()
  }
}

export const yokosukaLatestExtract = ($) => {
  let cells = $('.datatable td')
  let updateString = $(cells[1]).text() + ' #' +  $(cells[0]).text()

  return {
    latest:updateString
  }
}