import type { BookCategoryDocument } from '@lily-bookshop/schemas'

import type { EditedBookCategory } from './types'

import { API } from 'aws-amplify'

import { mutateBookCategories } from '../utils'

export const createBookCategory = async (
  bookCategory: BookCategoryDocument
) => {
  const result = await API.post('apicore', '/book-categories', {
    body: { bookCategory },
  })

  await mutateBookCategories()

  return result
}

export async function editBookCategory({ id, ...others }: EditedBookCategory) {
  const result = await API.patch('apicore', '/book-categories', {
    body: {
      id,
      bookCategory: others,
    },
  })

  await mutateBookCategories()

  return result
}
