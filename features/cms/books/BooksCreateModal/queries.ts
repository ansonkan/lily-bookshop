import type { BooksCreateFormik, BooksCreateQueryInput } from './types'

import { API, Storage } from 'aws-amplify'
import { mutate } from 'swr'

export async function createBooks(input: BooksCreateFormik) {
  const ts = new Date().valueOf()

  // upload images
  const imageUploadPromises: ReturnType<typeof Storage['put']>[] = []
  const objectKeyMap = new Map<File, string>()

  for (let i = 0; i < input.books.length; i++) {
    const b = input.books[i]

    if (!b.thumbnail || b.thumbnail.length === 0) continue

    const thumbnail = b.thumbnail[0]

    const thumbnailObjectKey = [
      'books',
      'thumbnail',
      b.ISBN_13 ||
        b.ISBN_10 ||
        [b.title, b.subtitle].filter((str) => !!str).join('_'),
      ts,
      i,
      thumbnail.name,
    ]
      .map((str) => encodeURIComponent(str))
      .join('/')

    objectKeyMap.set(thumbnail, thumbnailObjectKey)

    imageUploadPromises.push(
      Storage.put(thumbnailObjectKey, thumbnail, { level: 'public' })
    )
  }

  /**
   * TODO:
   * 1. need to create rollback for uploaded images if the POST failed or some of image uploads failed
   * 2. should FE submit everything to BE then BE handles the `Storage` calls?
   */
  await Promise.all(imageUploadPromises)

  // create books
  const newBooks: BooksCreateQueryInput = input.books.map((b) => ({
    ...b,
    thumbnail: b.thumbnail?.[0] ? objectKeyMap.get(b.thumbnail[0]) : undefined,
  }))

  const postResult = await API.post('apicore', '/books', {
    body: { books: newBooks },
  })

  mutate(
    (key) =>
      Array.isArray(key) &&
      typeof key[1] === 'string' &&
      key[1].startsWith('/books')
  )

  return postResult
}
