// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

interface Response {
  link: string
  file: Blob
}

// https://github.com/vercel/next.js/discussions/15453#discussioncomment-4651128
export default async function handler(
  { query }: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const link = query.link + ''

  // Note: Just to workaround the CORS when downloading images
  const response = await fetch(link)

  if (!response.ok) return res.status(404)

  res.writeHead(200, {
    'Content-Type': response.headers.get('Content-Type') ?? '',
    'Cache-Control': `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
  })

  res.end(Buffer.from(await response.arrayBuffer()))
}
