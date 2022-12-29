// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { Logger } from 'aws-amplify'

const logger = new Logger('sync')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.debug('debugging directus webhook events: ', {
    headers: req.headers,
    body: req.body,
    cookies: req.cookies,
    method: req.method,
    url: req.url,
    preview: req.preview,
    previewData: req.previewData,
  })

  res.status(200).json({ success: true })
}
