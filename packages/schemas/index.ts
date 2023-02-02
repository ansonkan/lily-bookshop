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

const cleanStrArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((v) => !!v) : []

const cleanStr = (value?: string) => (value ? value : null)

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
  subtitle: string().optional().nullable(),
  authors: array(string()).transform(cleanStrArray),
  about_the_authors: string().optional().nullable(),
  publisher: string().optional().nullable().transform(cleanStr),
  published_date: string().optional().nullable().transform(cleanStr), // not using number timestamp because some `published_date` only has year
  description: string().optional().nullable().transform(cleanStr),
  ISBN_13: string().length(13).optional().nullable().transform(cleanStr),
  ISBN_10: string().length(10).optional().nullable().transform(cleanStr),
  page_count: number().integer().min(1).optional(),
  // page_count: number()
  //   .integer()
  //   .min(1)
  //   .optional()
  //   .nullable()
  //   .transform(cleanStr),
  categories: array(string()).transform(cleanStrArray),
  /**
   * `thumbnail` object key:
   * - when create: `${ISBN_13 || ISBN_10 || title || request_id}/${timestamp}/${book_index}/${file_name}`
   * - use `encodeURIComponent`
   * - more about S3 object key: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
   */
  thumbnail: string().optional().nullable().transform(cleanStr),
  language: mixed<typeof LANG_CODES[number]>().oneOf(LANG_CODES),
  google_book_link: string().optional().nullable().transform(cleanStr),
  storage_location: string().optional().nullable().transform(cleanStr),
  quantity: number().integer().min(0).required().nullable(),
  highlight_order: number().integer().optional().nullable().transform(cleanStr),
  price: number().min(0).optional().nullable().transform(cleanStr),
  currency: mixed<typeof CURRENCIES[number]>().oneOf(CURRENCIES),
  date_restocked: number()
    .optional()
    .nullable()
    .test('is-not-future', (value, { path }) => {
      if (value === undefined || value === null) return true // since this is optional
      return validateDate(value, path)
    }),
})

export type BookDocument = InferType<typeof BookDocumentSchema>
