import type { EditedBook } from './types'
import type { FileValue } from 'components'

import { API, Storage } from 'aws-amplify'

import { mutateBooks } from '../utils'

export async function editBook({ id, ...others }: EditedBook) {
  const newThumbnailKeys = others.thumbnail
    ? await processFiles(others.thumbnail, id)
    : null

  const newOtherPhotosKeys = others.other_photos
    ? await processFiles(others.other_photos, id)
    : null

  // update book
  const result = await API.patch('apicore', '/books', {
    body: {
      id,
      book: {
        ...others,
        thumbnail: newThumbnailKeys ? newThumbnailKeys[0] : null,
        other_photos: newOtherPhotosKeys,
      },
    },
  })

  mutateBooks()

  return result
}

export async function processFiles(files: FileValue[], bookDocId: string) {
  const newKeys: string[] = []

  for (let i = 0; i < files.length; i++) {
    const f = files[i]

    switch (f.type) {
      case 's3-object':
        if (f.status === 'to-be-removed') {
          await Storage.remove(f.key, { level: 'public' })
        } else if (f.status === 'unchanged') {
          newKeys.push(f.key)
        }
        break

      case 'newly-uploaded-file': {
        const result = await Storage.put(
          `books/${bookDocId}/thumbnails`,
          f.file,
          { level: 'public' }
        )
        newKeys.push(result.key)
        break
      }
    }
  }

  return newKeys
}
