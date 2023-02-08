import type { InferType } from 'yup'

import { BookDocumentSchema } from '@lily-bookshop/schemas'

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

export interface DirectusArticle {
  id: string // uuid
  status: 'published' | 'draft' | 'archived'
  user_created: string // uuid
  date_created: string // e.g. 2022-12-29T08:49:35.384Z
  user_updated: string // uuid
  date_updated: string
  title: string
  content: string
}

export type BookDocument = InferType<typeof BookDocumentSchema>

// Book front-end
export interface BookFE extends BookDocument {
  id: string // MongoDB ObjectId.toString()
}

export interface ArticleDocument {
  status: 'published' | 'draft' | 'archived'
  user_created: string // user sub id
  date_created: number // new Date().getTime()
  user_updated: string // user sub id
  date_updated: number // new Date().getTime()
  title: string
  content: string
}

export interface ArticleFE extends ArticleDocument {
  id: string // MongoDB ObjectId.toString()
}
