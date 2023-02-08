import type { FileValue } from 'components'

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

  const fileToBeProcessed = [b.thumbnail?.[0], ...(b.other_photos || [])]

  const requestId = guid() + new Date().valueOf()
  for (let i = 0; i < fileToBeProcessed.length; i++) {
    const fileInput = fileToBeProcessed[i]
    if (!fileInput) continue

    switch (fileInput.type) {
      case 's3-object':
        break
      case 'newly-uploaded-file': {
        const objectKey = [
          'books',
          'create-request',
          requestId,
          i,
          fileInput.file.name,
        ]
          .map((str) => encodeURIComponent(str))
          .join('/')

        objectKeyMap.set(fileInput.file, objectKey)

        imageUploadPromises.push(
          Storage.put(objectKey, fileInput.file, { level: 'public' })
        )
        break
      }
    }
  }

  await Promise.all(imageUploadPromises)

  const postProcessFile = (f?: FileValue) => {
    if (!f) return
    if (f.type === 's3-object') return f.key
    if (f.type === 'newly-uploaded-file') return objectKeyMap.get(f.file)
  }

  const newBook: BookCreateQueryInput = {
    ...b,
    thumbnail: postProcessFile(b.thumbnail?.[0]),
    other_photos: b.other_photos
      ?.map((photos) => postProcessFile(photos))
      .filter((key): key is string => !!key),
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
