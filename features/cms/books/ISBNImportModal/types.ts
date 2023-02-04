import type { InferType } from 'yup'

import { ISBNImportSchema } from './schemas'

export type ISBNImportFormik = InferType<typeof ISBNImportSchema>

export interface GoogleBookSearchResult {
  kind: string
  totalItems: number
  items: Array<{
    kind?: string
    id?: string
    etag?: string
    selfLink?: string
    volumeInfo: {
      title?: string
      subtitle?: string
      authors?: string[]
      publisher?: string
      publishedDate?: string
      description?: string
      industryIdentifiers: Array<{ type: string; identifier: string }>
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
  }>
}
