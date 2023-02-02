import type { BookFE } from 'types'

import { API } from 'aws-amplify'

import { mutateBooks } from '../utils'

export async function deleteBook(book: BookFE) {
  const result = await API.del('apicore', '/books', { body: { id: book.id } })

  mutateBooks()

  return result
}
