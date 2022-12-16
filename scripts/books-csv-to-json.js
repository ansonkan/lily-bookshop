const fs = require('fs')
const path = require('path')

const csv = fs.readFileSync(path.join(__dirname, 'books.csv'))

const properties = [
  { key: 'isbn13', type: 'string' },
  { key: 'isbn10', type: 'string' },
  { key: 'title', type: 'string' },
  { key: 'subtitle', type: 'string' },
  { key: 'authors', type: 'string' },
  { key: 'categories', type: 'string' },
  { key: 'thumbnail', type: 'string' },
  { key: 'description', type: 'string' },
  { key: 'published_year', type: 'string' },
  { key: 'average_rating', type: 'number' },
  { key: 'num_pages', type: 'number' },
  { key: 'ratings_count', type: 'number' },
]

try {
  const booksInArrays = CSVToArray(csv.toString('utf8'))

  const books = []

  for (let i = 1; i < booksInArrays.length; i++) {
    const current = booksInArrays[i]
    const result = {}

    for (let k = 0; k < properties.length; k++) {
      const { key, type } = properties[k]

      result[key] =
        type === 'string' ? current[k] : Number.parseFloat(current[k])
    }

    books.push(result)
  }

  fs.writeFileSync(path.join(__dirname, 'books.json'), JSON.stringify(books))
} catch {
  console.error('Something went wrong...')
}

function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = strDelimiter || ','

  // Create a regular expression to parse the CSV values.
  const objPattern = new RegExp(
    // Delimiters.
    '(\\' +
      strDelimiter +
      '|\\r?\\n|\\r|^)' +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      '\\r\\n]*))',
    'gi'
  )

  // Create an array to hold our data. Give the array
  // a default empty first row.
  const arrData = [[]]

  // Create an array to hold our individual pattern
  // matching groups.
  let arrMatches = null

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    let strMatchedDelimiter = arrMatches[1]

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([])
    }

    let strMatchedValue

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"')
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[3]
    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue)
  }

  // Return the parsed data.
  return arrData
}
