import type { BookCategoryFE } from 'types'

import { API } from 'aws-amplify'

import { mutateBookCategories } from '../utils'

export async function deleteBookCategory(cat: BookCategoryFE) {
  const result = await API.del('apicore', '/books-categories', {
    body: { id: cat.id },
  })

  await mutateBookCategories()

  return result
}
