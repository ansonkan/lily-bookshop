import type { BookFE } from 'types'

import { removeNullProps } from './common'

export const formatDirectusBook = (book: BookFE) => {
  const cleaned = removeNullProps(book)

  if (cleaned.thumbnail) {
    cleaned.thumbnail = `${process.env.DIRECTUS_URL}assets/${cleaned.thumbnail}?download`
  }

  return cleaned
}

// export const populateThumbnailImg = async (
//   books: BookFE[],
//   loader: (key: string) => Promise<string>
// ) => {
//   const indexToS3Link: Record<number, string> = {}

//   const s3LinkPromises: Promise<{ index: number; link: string }>[] = []

//   books.forEach((b, index) => {
//     if (b.thumbnail) {
//       s3LinkPromises.push(
//         loader(b.thumbnail).then((link) => {
//           console.log('link: ', link)
//           return { index, link }
//         })
//       )
//     }
//   })

//   const results = await Promise.allSettled(s3LinkPromises)

//   results.forEach((r) => {
//     if (r.status === 'fulfilled') {
//       indexToS3Link[r.value.index] = r.value.link
//     }
//   })

//   console.log('indexToS3Link: ', indexToS3Link)
//   books.forEach((b, index) => {
//     if (b.thumbnail) {
//       b.thumbnail = indexToS3Link[index]
//     }
//   })

//   return books
// }
