import type { BookFE } from 'types'

import { API, Storage } from 'aws-amplify'
import { mutate } from 'swr'

export async function deleteBook(book: BookFE) {
  // delete book
  const result = await API.del('apicore', '/books', { body: { id: book.id } })

  // delete images
  if (book.thumbnail) {
    await Storage.remove(book.thumbnail, { level: 'public' })
  }

  mutate(
    (key) =>
      Array.isArray(key) &&
      typeof key[1] === 'string' &&
      key[1].startsWith('/books')
  )

  return result
}
