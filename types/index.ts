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

export interface GoogleBook {
  kind?: string
  id?: string
  etag?: string
  selfLink?: string
  volumeInfo?: {
    title?: string
    subtitle?: string
    authors?: string[]
    publisher?: string
    publishedDate?: string
    description?: string
    industryIdentifiers?: Array<{ type: string; identifier: string }>
    pageCount?: number
    printType?: string
    categories?: string[]
    averageRating?: number
    ratingsCount?: number
    maturityRating?: string
    allowAnonLogging?: boolean
    contentVersion?: string
    imageLinks?: {
      smallThumbnail?: string
      thumbnail?: string
    }
    language?: string
    previewLink?: string
    infoLink?: string
    canonicalVolumeLink?: string
  }
  saleInfo?: {
    country?: string
    saleability?: string
    isEbook?: boolean
  }
  accessInfo?: {
    country?: string
    viewability?: string
    embeddable?: boolean
    publicDomain?: boolean
    textToSpeechPermission?: string
    epub?: {
      isAvailable?: boolean
    }
    pdf?: {
      isAvailable?: boolean
    }
    webReaderLink?: string
    accessViewStatus?: string
    quoteSharingAllowed?: boolean
  }
  searchInfo?: {
    textSnippet?: string
  }
}

export interface NewGoogleBook
  extends Omit<
    BookFE,
    'id' | 'user_created' | 'date_created' | 'user_updated' | 'date_updated'
  > {
  original: GoogleBook
}
