import type { InferType } from 'yup'

import { array, mixed, number, object, string } from 'yup'

export const STATUSES = ['published', 'draft', 'archived'] as const
export const LANG_CODES = ['en', 'zh', 'ja', 'ko', 'ru', 'de'] as const // ISO 639-1 code (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
export const CURRENCIES = ['HKD'] as const

export const BookDocumentSchema = object({
  status: mixed<typeof STATUSES[number]>().oneOf(STATUSES).required(),
  user_created: string().required(), // user sub id
  date_created: number().required(), // new Date().getTime()
  user_updated: string().required(), // user sub id
  date_updated: number().required(), // new Date().getTime()
  title: string().required(),
  subtitle: string().optional(),
  authors: array(string().required()).required(),
  about_the_author: string().optional(),
  publisher: string().optional(),
  published_date: string().optional(),
  description: string().optional(),
  ISBN_13: string().length(13).optional(),
  ISBN_10: string().length(10).optional(),
  page_count: number().min(1).optional(),
  categories: array(string().required()).required(),
  thumbnail: string().optional(),
  language: mixed<typeof LANG_CODES[number]>().oneOf(LANG_CODES).optional(),
  google_book_link: string().optional(),
  storage_location: string().optional(),
  quantity: number().min(0).required(),
  highlight_order: number().integer().optional(),
  price: number().min(0).optional(),
  currency: mixed<typeof CURRENCIES[number]>().oneOf(CURRENCIES).optional(),
  date_restocked: number().optional(),
})

export type BookDocument = InferType<typeof BookDocumentSchema>
