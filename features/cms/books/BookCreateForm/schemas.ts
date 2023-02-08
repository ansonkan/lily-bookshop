import type { FileValue } from 'components'

import { array, mixed, object } from 'yup'
import { BookDocumentSchema } from '@lily-bookshop/schemas'

export const NewBookSchema = BookDocumentSchema.omit([
  'date_created',
  'user_created',
  'date_updated',
  'user_updated',
  'thumbnail',
  'other_photos',
]).concat(
  object({
    thumbnail: array().max(1).of(mixed<FileValue>().required()),
    other_photos: array().max(5).of(mixed<FileValue>().required()),
  })
)
