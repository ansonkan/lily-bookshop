const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const got = require('got')
const iconv = require('iconv-lite')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const bookIds = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'books.json')).toString('utf8')
)

/**
 * Examples:
 * 1. https://www.googleapis.com/books/v1/volumes?q=search+terms
 * 2. https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=yourAPIKey
 */
const GOOGLE_BOOK_URL = 'https://www.googleapis.com/books/v1/volumes'

main()

// https://www.googleapis.com/books/v1/volumes?q=isbn:9780006380832

async function main() {
  let books = []
  const fails = []
  const multiMatches = []
  let parsed = []

  for (let i = 0; i < bookIds.length; i++) {
    // for (let i = 0; i < 10; i++) {
    const id = bookIds[i]
    const { isbn13, isbn10 } = id

    const isbn = isbn13 ?? isbn10

    if (!isbn) {
      continue
    }

    const queryUrl = GOOGLE_BOOK_URL + `?q=isbn:${isbn}`

    try {
      const result = await (await fetch(queryUrl)).json()

      if (result.totalItems === 0) {
        fails.push(id)
      } else if (result.totalItems === 1) {
        books.push(
          await populateAboutTheAuthor(
            transformGoogleBook(result.items[0].volumeInfo)
          )
        )
        // books.push(result.items[0].volumeInfo)
      } else {
        multiMatches.push({ queryUrl, items: result.items })
      }
    } catch (err) {
      fails.push({ id, error: JSON.stringify(err) })
    }

    if (books.length >= 50) {
      await importToDirectus(books)
      parsed = [...parsed, ...books]
      books = []
    }
  }

  if (books.length) {
    await importToDirectus(books)
    parsed = [...parsed, ...books]
  }

  fs.writeFileSync(
    path.join(__dirname, 'google-books.json'),
    JSON.stringify({ books: parsed, fails, multiMatches })
  )

  console.log(
    'Done!',
    `\n${parsed.length} books imported`,
    `\n${fails.length} fails`,
    `\n${multiMatches.length} multi-matches`
  )
}

function transformGoogleBook(googleBook) {
  const {
    title,
    subtitle,
    authors,
    publisher,
    publishedDate,
    description,
    industryIdentifiers,
    pageCount,
    categories,
    imageLinks,
    language,
    previewLink,
    infoLink,
    canonicalVolumeLink,
  } = googleBook

  return {
    title,
    subtitle,
    authors,
    publisher,
    publishedDate,
    description,
    // industryIdentifiers,
    ...industryIdentifiers.reduce((acc, cur) => {
      acc[cur.type] = cur.identifier
      return acc
    }, {}),
    pageCount,
    categories,
    // removing `zoom=1` to get a higher quality thumbnail
    // thumbnail: imageLinks.thumbnail.replace('&zoom=1', ''),
    // not every link works out at the end... and it is hard to detect images that is unavailable
    thumbnail: imageLinks.thumbnail,
    language,
    googleBookLink: infoLink || previewLink || canonicalVolumeLink,
  }
}

async function populateAboutTheAuthor(googleBook) {
  if (googleBook.googleBookLink) {
    // https://blog.clarence.tw/2021/01/18/node-js-crawler-uses-got-and-iconv-to-solve-the-problem-of-garbled-characters-in-big5-to-utf-8-webpage/
    const response = await got(googleBook.googleBookLink)
    response.body = iconv.decode(Buffer.from(response.rawBody), 'big5')

    const $ = cheerio.load(response.body)

    const synopsistext = $('#synopsistext').text()

    if (
      !!synopsistext &&
      (!googleBook.description ||
        googleBook.description.length < synopsistext.length)
    ) {
      googleBook.description = synopsistext
    }

    googleBook.aboutTheAuthor = $('#about_author_v').text()
  }

  return googleBook
}

async function importToDirectus(books) {
  try {
    const results = await Promise.allSettled(
      books.map((b) =>
        fetch(process.env.DIRECTUS_URL + 'files/import', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
          },
          body: JSON.stringify({
            url: b.thumbnail,
            data: {
              title: b.title,
            },
          }),
        })
      )
    )

    for (let i = 0; i < results.length; i++) {
      const value = await results[i].value.json()
      books[i].thumbnailLink = books[i].thumbnail
      books[i].thumbnail = value.data.id
    }

    books.status = 'published'

    const result = await fetch(process.env.DIRECTUS_URL + 'items/Books', {
      method: 'POST',
      body: JSON.stringify(books),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
      },
    })

    // const json = await result.json()
  } catch (error) {
    console.error(error)
  }
}
