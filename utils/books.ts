import type { MongoDbBook } from 'types'

import { removeNullProps } from './common'

export const formatDirectusBook = (book: MongoDbBook) => {
  const cleaned = removeNullProps(book)

  if (cleaned.thumbnail) {
    cleaned.thumbnail = `${process.env.DIRECTUS_URL}assets/${cleaned.thumbnail}?download`
  }

  return cleaned
}
