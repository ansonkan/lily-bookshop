import type {
  BookCreateQueryInput,
  BookCreateQueryResult,
  NewBook,
} from './types'

import { API, Storage } from 'aws-amplify'

import { guid } from 'utils'

import { mutateBooks } from '../utils'

export async function createBook(b: NewBook) {
  // upload images
  const imageUploadPromises: ReturnType<typeof Storage['put']>[] = []
  const objectKeyMap = new Map<File | string, string>() // File / URL

  const thumbnail = b.thumbnail?.[0]

  if (thumbnail) {
    switch (thumbnail.type) {
      case 's3-object':
        break
      case 'newly-uploaded-file': {
        const thumbnailObjectKey = [
          'books',
          'create-request',
          guid() + new Date().valueOf(),
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
    }
  }

  await Promise.all(imageUploadPromises)

  const t = b.thumbnail?.[0]
  const newBook: BookCreateQueryInput = {
    ...b,
    thumbnail:
      t && t.type === 'newly-uploaded-file'
        ? objectKeyMap.get(t.file)
        : undefined,
  }

  const postResult: BookCreateQueryResult = await API.post(
    'apicore',
    '/books',
    {
      body: { book: newBook },
    }
  )

  mutateBooks()

  return postResult
}
