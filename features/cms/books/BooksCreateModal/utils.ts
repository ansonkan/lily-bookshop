import type { InferType } from 'yup'

import { array, object } from 'yup'
import { BookDocumentSchema } from '@lily-bookshop/schemas'

export const NewBookSchema = BookDocumentSchema.omit([
  'date_created',
  'user_created',
  'date_updated',
  'user_updated',
])

export type NewBook = InferType<typeof NewBookSchema>

export const BooksCreateFormikSchema = object({
  books: array().required().min(1).of(NewBookSchema),
})

export type BooksCreateFormik = InferType<typeof BooksCreateFormikSchema>
