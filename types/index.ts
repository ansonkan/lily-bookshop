// would be perfect if I found a way to generate types from Directus data models
export interface DirectusBook {
  id: string // uuid
  status: 'published' | 'draft' | 'archived'
  user_created: string // uuid
  date_created: string // e.g. 2022-12-29T08:49:35.384Z
  user_updated: string // uuid
  date_updated: string
  title: string
  subtitle?: string | null
  authors?: string[] | null
  aboutTheAuthor?: string | null
  publisher?: string | null
  publishedDate?: string | null
  description?: string | null
  ISBN_13?: string | null
  ISBN_10?: string | null
  pageCount?: number | null
  categories?: string[] | null
  thumbnail?: string | null
  language?: string | null // ISO 639-1 code (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
  googleBookLink?: string | null
  storageLocation?: string | null
  quantity?: number | null
  highlightOrder?: number | null
  price?: number | null
  currency?: string | null
  dateRestocked?: string | null
}

export interface MongoDbBook extends Omit<DirectusBook, 'id'> {
  directusId: string
}

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

/**
 * Tt seems all fields from `Directus` can be `null` by default, and `undefined` is not a valid JSON value anyway,
 * but `undefined` works better in JS I think, so let's use `DirectusBook` for everything returned from
 * `Directus` or `MongoDB Atlas`
 */
export type Book = NonNullableFields<MongoDbBook>

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
