import { BookDocument } from '@lily-bookshop/schemas'
import type { InferType } from 'yup'

import { BooksCreateFormikSchema, NewBookSchema } from './schemas'

export type NewBook = InferType<typeof NewBookSchema>

export type BooksCreateFormik = InferType<typeof BooksCreateFormikSchema>

export type BooksCreateQueryInput = Omit<
  BookDocument,
  'date_created' | 'user_created' | 'date_updated' | 'user_updated'
>[]
