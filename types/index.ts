export interface Price {
  amount: number
  currencyCode: string
}

export interface Book {
  id: string
  title: string
  authors: string[]
  price: Price
  description: string
  imageLink?: string
}

export interface DirectusBook {
  id: string // uuid
  status: 'published' | 'draft' | 'archived'
  user_created: string // uuid
  date_created: string // e.g. 2022-12-29T08:49:35.384Z
  user_updated: string // uuid
  date_updated: string
  title: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  ISBN_13?: string
  ISBN_10?: string
  pageCount?: number
  categories?: string[]
  thumbnail?: string
  language?: string // ISO 639-1 code (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
  googleBookLink?: string
  storageLocation?: string
  quantity?: number
  highlightOrder?: number
  price?: number
  currency?: string
}

export interface DirectusArticle {
  id: string // uuid
  status: 'published' | 'draft' | 'archived'
  user_created: string // uuid
  date_created: string // e.g. 2022-12-29T08:49:35.384Z
  user_updated: string // uuid
  date_updated: string
  title: string
}
