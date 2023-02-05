import type { GoogleBook } from './types'
import type { NewBook } from '../BooksCreateModal/types'

import { LANG_CODES } from '@lily-bookshop/schemas'
import mime from 'mime-types'

import { INITIAL_BOOK } from '../BooksCreateModal/constants'

export const googleBookToNewBook = async (
  googleBooks: GoogleBook[]
): Promise<NewBook[]> => {
  const [thumbnailMap, aboutMap] = await Promise.all([
    getGoogleBookThumbnails(googleBooks),
    getAboutTheAuthors(googleBooks),
  ])

  return googleBooks.map((gb) => {
    const { ISBN, ISBN_10, ISBN_13 } = getISBN(gb)
    const googleBookLink = getGoogleBookLink(gb)
    const thumbnailFile = ISBN ? thumbnailMap.get(ISBN) : undefined

    return {
      ...INITIAL_BOOK,
      ...(gb.volumeInfo || {}),
      title: gb.volumeInfo?.title || '',
      subtitle: gb.volumeInfo?.subtitle,
      authors: gb.volumeInfo?.authors,
      about_the_authors: googleBookLink ? aboutMap[googleBookLink] : undefined,
      publisher: gb.volumeInfo?.publisher,
      published_date: gb.volumeInfo?.publishedDate,
      description: gb.volumeInfo?.description,
      ISBN_13,
      ISBN_10,
      page_count: gb.volumeInfo?.pageCount,
      // categories: [], (WIP)
      thumbnail: thumbnailFile
        ? [{ type: 'newly-uploaded-file', file: thumbnailFile }]
        : undefined,
      language: LANG_CODES.find((c) => c === gb.volumeInfo?.language),
      google_book_link: getGoogleBookLink(gb),
      // storage_location: undefined (WIP)
    }
  })
}

export const getGoogleBookThumbnails = async (
  googleBooks: GoogleBook[]
): Promise<Map<string, File>> => {
  const thumbnailMap = new Map<string, File>() // ISBN: File

  const thumbnailPromises: Promise<{ ISBN: string; thumbnailFile: File }>[] = []
  googleBooks.forEach((gb) => {
    const thumbnailLink =
      gb.volumeInfo?.imageLinks?.thumbnail ||
      gb.volumeInfo?.imageLinks?.smallThumbnail

    const { ISBN } = getISBN(gb)

    if (thumbnailLink && ISBN) {
      thumbnailPromises.push(
        fetch(
          `/api/download-cors-file?link=${encodeURIComponent(thumbnailLink)}`
        )
          .then((r) => r.blob())
          .then((blob) => ({
            ISBN,
            thumbnailFile: new File(
              [blob],
              blob.name ||
                `new-file-${new Date().valueOf()}.${mime.extension(blob.type)}`,
              { type: blob.type }
            ),
          }))
      )
    }
  })

  const thumbnailResults = await Promise.allSettled(thumbnailPromises)
  thumbnailResults.forEach((tr) => {
    if (tr.status === 'fulfilled') {
      thumbnailMap.set(tr.value.ISBN, tr.value.thumbnailFile)
    }
  })

  return thumbnailMap
}

export const getAboutTheAuthors = async (
  googleBooks: GoogleBook[]
): Promise<Record<string, string>> => {
  const links = googleBooks
    .map((gb) => getGoogleBookLink(gb))
    .filter((l): l is string => !!l)

  return fetch(
    `/api/crawl-about-the-authors?links=${links
      .map((l) => encodeURIComponent(l))
      .join(',')}`
  )
    .then(
      (res) =>
        res.json() as Promise<{
          aboutMap: Record<string, string>
        }>
    )
    .then((json) => json.aboutMap)
}

function getISBN(googleBook: GoogleBook) {
  const industryIdentifiers = googleBook.volumeInfo?.industryIdentifiers
  const ISBN_13 = industryIdentifiers?.find(
    (identity) => identity.type === 'ISBN_13'
  )?.identifier
  const ISBN_10 = industryIdentifiers?.find(
    (identity) => identity.type === 'ISBN_10'
  )?.identifier

  return {
    ISBN: ISBN_13 || ISBN_10,
    ISBN_13,
    ISBN_10,
  }
}

function getGoogleBookLink({ volumeInfo }: GoogleBook) {
  const { infoLink, previewLink, canonicalVolumeLink } = volumeInfo || {}
  return infoLink || previewLink || canonicalVolumeLink
}
