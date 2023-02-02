import type { EditedBook } from './types'
import type { FileValue } from 'components'

import { API, Storage } from 'aws-amplify'

import { mutateBooks } from '../utils'

export async function editBook({ id, ...others }: EditedBook) {
  const thumbnailKey = others.thumbnail
    ? await processThumbnail(others.thumbnail, id)
    : undefined

  // update book
  const result = await API.patch('apicore', '/books', {
    body: { id, book: { ...others, thumbnail: thumbnailKey } },
  })

  mutateBooks()

  return result
}

export async function processThumbnail(files: FileValue[], bookDocId: string) {
  let newThumbnailKey: string | null = null

  for (let i = 0; i < files.length; i++) {
    const f = files[i]

    switch (f.type) {
      case 's3-object':
        if (f.status === 'to-be-removed') {
          await Storage.remove(f.key, { level: 'public' })
        } else if (f.status === 'unchanged') {
          newThumbnailKey = f.key
        }
        break
      case 'newly-uploaded-url':
        // TODO
        break
      case 'newly-uploaded-file': {
        const result = await Storage.put(
          `books/${bookDocId}/thumbnails`,
          f.file,
          { level: 'public' }
        )
        newThumbnailKey = result.key

        break
      }
    }
  }

  return newThumbnailKey
}
