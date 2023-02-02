import type { BooksCreateFormik, BooksCreateQueryInput } from './types'

import { API, Storage } from 'aws-amplify'

import { guid } from 'utils'

import { mutateBooks } from '../utils'

export async function createBooks(input: BooksCreateFormik) {
  // upload images
  const imageUploadPromises: ReturnType<typeof Storage['put']>[] = []
  const objectKeyMap = new Map<File | string, string>() // File / URL

  for (let i = 0; i < input.books.length; i++) {
    const b = input.books[i]

    const thumbnail = b.thumbnail?.[0]

    if (!thumbnail) continue

    switch (thumbnail.type) {
      case 's3-object':
        break
      case 'newly-uploaded-file': {
        const thumbnailObjectKey = [
          'books',
          'create-request',
          guid(),
          i,
          thumbnail.file.name,
        ]
          .map((str) => encodeURIComponent(str))
          .join('/')

        objectKeyMap.set(thumbnail.file, thumbnailObjectKey)

        imageUploadPromises.push(
          Storage.put(thumbnailObjectKey, thumbnail.file, { level: 'public' })
        )
        break
      }
      case 'newly-uploaded-url':
        // TODO
        break
    }
  }

  /**
   * TODO:
   * 1. need to create rollback for uploaded images if the POST failed or some of image uploads failed
   * 2. should FE submit everything to BE then BE handles the `Storage` calls?
   */
  await Promise.all(imageUploadPromises)

  // create books
  const newBooks: BooksCreateQueryInput = input.books.map((b) => {
    const t = b.thumbnail?.[0]

    return {
      ...b,
      thumbnail:
        t && t.type === 'newly-uploaded-file'
          ? objectKeyMap.get(t.file)
          : undefined,
    }
  })

  const postResult = await API.post('apicore', '/books', {
    body: { books: newBooks },
  })

  mutateBooks()

  return postResult
}
