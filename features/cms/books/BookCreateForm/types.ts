import { BookDocument } from '@lily-bookshop/schemas'
import type { InferType } from 'yup'

import { NewBookSchema } from './schemas'

export type NewBook = InferType<typeof NewBookSchema>

export type BookCreateQueryInput = Omit<
  BookDocument,
  'date_created' | 'user_created' | 'date_updated' | 'user_updated'
>

export interface BookCreateQueryResult {
  result: { acknowledged: boolean; insertedId?: string }
}
