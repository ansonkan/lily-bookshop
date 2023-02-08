import type { InferType } from 'yup'

import type { GoogleBook } from 'types'

import { ISBNImportSchema } from './schemas'

export type ISBNImportFormik = InferType<typeof ISBNImportSchema>

export interface GoogleBookSearchResult {
  kind: string
  totalItems: number
  items?: GoogleBook[]
}
