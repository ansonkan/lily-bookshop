import type { InferType } from 'yup'

import { ValidationError, array, mixed, number, object, string } from 'yup'

export const STATUSES = ['published', 'draft'] as const
export const LANG_CODES = ['en', 'zh', 'ja', 'ko', 'ru', 'de', 'fr'] as const // ISO 639-1 code (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
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

export const cleanStrArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((v) => !!v) : []

export const cleanStr = (value?: string) => (value ? value : null)

export const hasOnlyNumericChar = (value: string) => /^\d+$/gm.test(value)

export const ISBNSchema = () =>
  string().optional().nullable().transform(cleanStr)

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
  subtitle: string().optional().nullable().transform(cleanStr),
  authors: array(string()).transform(cleanStrArray),
  about_the_authors: string().optional().nullable(),
  publisher: string().optional().nullable().transform(cleanStr),
  published_date: string().optional().nullable().transform(cleanStr), // not using number timestamp because some `published_date` only has year
  description: string().optional().nullable().transform(cleanStr),
  ISBN_13: ISBNSchema().length(13),
  ISBN_10: ISBNSchema().length(10),
  page_count: number()
    .integer()
    .min(1)
    .optional()
    .nullable()
    .transform(cleanStr),
  categories: array(string().defined()).transform(cleanStrArray),
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
  other_photos: array(string().defined()).transform(cleanStrArray),
})

export type BookDocument = InferType<typeof BookDocumentSchema>

export const BookCategoryDocumentSchema = object({
  en: string().required().defined(),
  zh_HK: string().required().defined(),
})

export type BookCategoryDocument = InferType<typeof BookCategoryDocumentSchema>
