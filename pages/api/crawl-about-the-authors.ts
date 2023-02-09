// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import * as cheerio from 'cheerio'
import * as iconv from 'iconv-lite'
import got from 'got'

interface Response {
  aboutMap: Record<string, string>
}

// https://github.com/vercel/next.js/discussions/15453#discussioncomment-4651128
export default async function handler(
  { query }: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const links = (query.links + '').split(',')

  const aboutMap = await crawlAboutTheAuthor(links)

  res.setHeader(
    'Cache-Control',
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  )

  return res.status(200).json({ aboutMap })
}

async function crawlAboutTheAuthor(googleBookLinks: string[]) {
  const linkToAboutMap: Record<string, string> = {}

  const results = await Promise.allSettled(
    googleBookLinks.map((link) =>
      got(link).then((res) => {
        const body = iconv.decode(Buffer.from(res.rawBody), 'big5')

        const $ = cheerio.load(body)

        // https://github.com/cheeriojs/cheerio/issues/839#issuecomment-379737480
        const paragraphs: string[] = []

        $('#about_author_v p').each(function (i, elem) {
          paragraphs.push($(elem).find('br').replaceWith('\n\n').end().text())
        })

        return [link, paragraphs.filter((p) => !!p).join('\n\n')]
      })
    )
  )

  results.forEach((r) => {
    if (r.status === 'fulfilled') {
      linkToAboutMap[r.value[0]] = r.value[1]
    }
  })

  return linkToAboutMap

  // if (googleBook.googleBookLink) {
  //   // https://blog.clarence.tw/2021/01/18/node-js-crawler-uses-got-and-iconv-to-solve-the-problem-of-garbled-characters-in-big5-to-utf-8-webpage/
  //   const response = await got(googleBook.googleBookLink)
  //   response.body = iconv.decode(Buffer.from(response.rawBody), 'big5')

  //   const $ = cheerio.load(response.body)

  //   const synopsistext = $('#synopsistext').text()

  //   if (
  //     !!synopsistext &&
  //     (!googleBook.description ||
  //       googleBook.description.length < synopsistext.length)
  //   ) {
  //     googleBook.description = synopsistext
  //   }

  //   return {
  //     ...googleBook,
  //     aboutTheAuthor: $('#about_author_v').text(),
  //   }
  // }

  // return googleBook
}
