import type { BooksCreateFormik, BooksCreateQueryInput } from './types'

import { API, Storage } from 'aws-amplify'

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

  await Promise.all(imageUploadPromises)

  // create books
  const newBooks: BooksCreateQueryInput = input.books.map((b) => ({
    ...b,
    thumbnail: b.thumbnail?.[0] ? objectKeyMap.get(b.thumbnail[0]) : undefined,
  }))

  const postResult = await API.post('apicore', '/books', {
    body: { books: newBooks },
  })

  return postResult
}
