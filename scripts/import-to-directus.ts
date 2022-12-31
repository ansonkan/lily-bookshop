import { DirectusBook } from '../types'

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as cheerio from 'cheerio'
import got from 'got'
import * as iconv from 'iconv-lite'
import { faker } from '@faker-js/faker'

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

interface BookId {
  isbn13?: string
  isbn10?: string
  title?: string
  authors?: string
}

// Only what is needed has been typed!! These are not the only fields returned from Google Book API
interface GoogleBookSearchResult {
  kind: string
  totalItems: number
  items: Array<{
    volumeInfo: {
      title: string
      subtitle?: string
      authors?: string[]
      publisher?: string
      publishedDate?: string
      description?: string
      industryIdentifiers?: Array<{ type: string; identifier: string }>
      pageCount?: number
      categories?: string[]
      imageLinks?: {
        smallThumbnail?: string
        thumbnail?: string
      }
      language?: string
      previewLink?: string
      infoLink?: string
      canonicalVolumeLink?: string
    }
  }>
}

type CreateDirectusBookProps = Omit<
  DirectusBook,
  'id' | 'user_created' | 'date_created' | 'user_updated' | 'date_updated'
>

const bookIds: BookId[] = JSON.parse(
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

const fails: Array<Record<string, unknown>> = []

async function main() {
  let books: CreateDirectusBookProps[] = []

  let parsed: CreateDirectusBookProps[] = []

  // for (let i = 0; i < bookIds.length; i++) {
  for (let i = 0; i < 55; i++) {
    const id = bookIds[i]
    const { isbn13, isbn10 } = id

    const isbn = isbn13 ?? isbn10

    if (!isbn) {
      continue
    }

    const queryUrl = GOOGLE_BOOK_URL + `?q=isbn:${isbn}`

    try {
      const result: GoogleBookSearchResult = await (
        await fetch(queryUrl)
      ).json()

      if (result.totalItems === 0) {
        fails.push({ id, reason: 'totalItems === 0' })
        continue
      } else if (result.totalItems === 1) {
        books.push({
          ...(await populateAboutTheAuthor(
            transformGoogleBook(result.items[0].volumeInfo)
          )),
          // When we actually importing real books, these information should be given at the start
          storageLocation: `bookshelf:${faker.random.alpha({
            count: 2,
            casing: 'upper',
          })}`,
          quantity: 1,
          // highlightOrder: -1
          price: faker.datatype.float({ min: 20, max: 200, precision: 0.01 }),
          currency: 'HKD',
          status: 'published',
        })
      } else {
        fails.push({ id, reason: 'multiple matches' })
        continue
      }
    } catch (err) {
      fails.push({ id, error: JSON.stringify(err) })
    }

    if (books.length >= 10) {
      console.log(`Starting batch import, index: ${i} ...`)

      await importToDirectus(books)
      parsed = [...parsed, ...books]
      books = []

      console.log(`Finished batch import, index: ${i}`)
    }
  }

  if (books.length) {
    console.log('Starting the last batch import')

    await importToDirectus(books)
    parsed = [...parsed, ...books]

    console.log('Finished the last batch import')
  }

  fs.writeFileSync(
    path.join(__dirname, 'data', 'imported.json'),
    JSON.stringify({ books: parsed })
  )

  fs.writeFileSync(
    path.join(__dirname, 'data', 'failed.json'),
    JSON.stringify({ fails })
  )

  console.log(
    'Done!',
    `\n${parsed.length} books imported`,
    `\n${fails.length} fails`,
    '\n\n'
  )
}

function transformGoogleBook(
  googleBook: GoogleBookSearchResult['items'][number]['volumeInfo']
) {
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
    // industryIdentifiers -> { ISBN_13, ISBN_10 }
    ...industryIdentifiers?.reduce((acc, cur) => {
      acc[cur.type] = cur.identifier
      return acc
    }, {} as Record<string, string>),
    pageCount,
    categories,
    // removing `zoom=1` to get a higher quality thumbnail
    // thumbnail: imageLinks.thumbnail.replace('&zoom=1', ''),
    // not every link works out at the end... and it is hard to detect images that is unavailable
    thumbnail: imageLinks?.thumbnail || imageLinks?.smallThumbnail,
    language,
    googleBookLink: infoLink || previewLink || canonicalVolumeLink,
  }
}

async function populateAboutTheAuthor(
  googleBook: ReturnType<typeof transformGoogleBook>
) {
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

    return {
      ...googleBook,
      aboutTheAuthor: $('#about_author_v').text(),
    }
  }

  return googleBook
}

async function importToDirectus(books: CreateDirectusBookProps[]) {
  for (const b of books) {
    try {
      if (b.title) {
        const thumbnailResult = await fetch(
          process.env.DIRECTUS_URL + 'files/import',
          {
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
                // folder `public`
                folder: '5a16839a-d3fd-4e24-a03d-4f184ed67e8f',
              },
            }),
          }
        )

        const value = await thumbnailResult.json()

        b.thumbnail = value.data.id
      }

      await fetch(process.env.DIRECTUS_URL + 'items/books', {
        method: 'POST',
        body: JSON.stringify(b),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
        },
      })
    } catch (err) {
      fails.push({ book: b, err: JSON.stringify(err) })
    }
  }

  // try {
  //   console.log('Start importing books to Directus...')

  //   const results = await Promise.allSettled(
  //     books.map((b) =>
  //       fetch(process.env.DIRECTUS_URL + 'files/import', {
  //         method: 'POST',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
  //         },
  //         body: JSON.stringify({
  //           url: b.thumbnail,
  //           data: {
  //             title: b.title,
  //             // folder `public`
  //             folder: '5a16839a-d3fd-4e24-a03d-4f184ed67e8f',
  //           },
  //         }),
  //       })
  //     )
  //   )

  //   for (let i = 0; i < results.length; i++) {
  //     const result = results[i]
  //     if (result.status === 'fulfilled') {
  //       const value = await result.value.json()
  //       books[i].thumbnail = value.data.id
  //     }
  //   }

  //   const result = await fetch(process.env.DIRECTUS_URL + 'items/books', {
  //     method: 'POST',
  //     body: JSON.stringify(books),
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
  //     },
  //   })

  //   console.log(
  //     `Imported ${results.length} books to Directus!`,
  //     JSON.stringify(result, null, 2),
  //     '\n\n'
  //   )
  // } catch (error) {
  //   console.error(error)
  // }
}
