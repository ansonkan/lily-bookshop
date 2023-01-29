import type { InferType } from 'yup'

import { ValidationError, array, mixed, number, object, string } from 'yup'

export const STATUSES = ['published', 'draft', 'archived'] as const
export const LANG_CODES = ['en', 'zh', 'ja', 'ko', 'ru', 'de'] as const // ISO 639-1 code (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
export const CURRENCIES = ['HKD'] as const

// TODO: might need to use `dayjs` to validate timestamps and date strings

const validateDate = (value: number, path: string) => {
  const date = new Date(value)
  if (isNaN(date.valueOf()))
    return new ValidationError(`${path} is not a valid date`, value, path)

  if (date.valueOf() > new Date().valueOf())
    return new ValidationError(`${path} cannot be in the future`, value, path)

  return true
}

export const BookDocumentSchema = object({
  status: mixed<typeof STATUSES[number]>().oneOf(STATUSES).required(),
  user_created: string().required(), // user sub id
  date_created: number()
    .required()
    .test('is-not-future', (value, { path }) => validateDate(value, path)), // new Date().getTime()
  user_updated: string().required(), // user sub id
  date_updated: number()
    .required()
    .test('is-not-future', (value, { path }) => validateDate(value, path)), // new Date().getTime()
  title: string().required(),
  subtitle: string().optional(),
  authors: array(string().required()).required(),
  about_the_authors: string().optional(),
  publisher: string().optional(),
  published_date: string().optional(), // not using number timestamp because some `published_date` only has year
  description: string().optional(),
  ISBN_13: string()
    .length(13)
    .optional()
    .transform((value) => (value ? value : undefined)),
  ISBN_10: string()
    .length(10)
    .optional()
    .transform((value) => (value ? value : undefined)),
  page_count: number().integer().min(1).optional(),
  categories: array(string().required()).required(),
  /**
   * `thumbnail` object key:
   * - when create: `${ISBN_13 || ISBN_10 || title || request_id}/${timestamp}/${book_index}/${file_name}`
   * - use `encodeURIComponent`
   * - more about S3 object key: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
   */
  thumbnail: string().optional(),
  language: mixed<typeof LANG_CODES[number]>().oneOf(LANG_CODES).optional(),
  google_book_link: string().optional(),
  storage_location: string().optional(),
  quantity: number().integer().min(0).required(),
  highlight_order: number().integer().optional(),
  price: number().min(0).optional(),
  currency: mixed<typeof CURRENCIES[number]>().oneOf(CURRENCIES).optional(),
  date_restocked: number()
    .optional()
    .test('is-not-future', (value, { path }) => {
      if (value === undefined) return true // since this is optional
      return validateDate(value, path)
    }),
})

export type BookDocument = InferType<typeof BookDocumentSchema>
