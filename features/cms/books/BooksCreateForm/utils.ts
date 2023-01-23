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
  books: array().of(NewBookSchema).required(),
})

export type BooksCreateFormik = InferType<typeof BooksCreateFormikSchema>

export const initialBook: NewBook = {
  status: 'draft',
  title: '',
  authors: [],
  categories: [],
  quantity: 1,
}

export const initialBooks: BooksCreateFormik = {
  books: [initialBook],
}
