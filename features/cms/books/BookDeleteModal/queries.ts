import type { BookFE } from 'types'

import { API } from 'aws-amplify'
import { mutate } from 'swr'

export async function deleteBook(book: BookFE) {
  const result = await API.del('apicore', '/books', { body: { id: book.id } })

  mutate(
    (key) =>
      Array.isArray(key) &&
      typeof key[1] === 'string' &&
      key[1].startsWith('/books')
  )

  return result
}
