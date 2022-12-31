// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { captureException, captureMessage } from '@sentry/nextjs'
import { MongoClient } from 'mongodb'

const trimReq = ({
  url,
  body,
  headers,
  cookies,
  httpVersion,
  method,
  query,
}: NextApiRequest) => ({
  url,
  body,
  headers,
  cookies,
  httpVersion,
  method,
  query,
})

// This endpoint is to sync Directus items to MongoDB Atlas because MongoDB Atlas is needed for the free text search
// Could use https://webhook.site/#!/ to test Directus webhook payload
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.MONGODB_URL_READ_WRITE) {
    throw new Error(
      'Invalid/Missing environment variable: "MONGODB_URL_READ_WRITE"'
    )
  }

  const client = new MongoClient(process.env.MONGODB_URL_READ_WRITE)

  try {
    validate(req)

    // for debugging
    captureMessage(JSON.stringify(trimReq(req)))

    const { event, collection, keys, key, payload } = req.body

    await client.connect()
    const dbCollection = client.db('bookshop').collection(collection)

    switch (event) {
      case 'items.create':
        await dbCollection.insertOne({ directusId: key, ...payload })
        break

      case 'items.update':
        if (keys) {
          await dbCollection.updateMany(
            { directusId: { $in: keys } },
            { $set: payload }
          )
        } else {
          await dbCollection.updateOne({ directusId: key }, { $set: payload })
        }
        break

      case 'items.delete':
        if (keys) {
          await dbCollection.deleteMany({ directusId: { $in: keys } })
        } else {
          await dbCollection.deleteOne({ directusId: key })
        }
        break
    }

    res.status(200).json({ success: true })
  } catch (err) {
    captureException(err)
    res.status(500).json({ success: false })
  } finally {
    await client.close()
  }
}

function validate(req: NextApiRequest) {
  // a hacky protection against abuse of this endpoint, similar to the pathname of this endpoint
  if (
    req.headers['directus-webhook'] !==
    process.env.DIRECTUS_WEBHOOK_SYNC_DB_AUTH_HEADER
  ) {
    throw new Error('401: Unauthorized', { cause: trimReq(req) })
  }

  if (req.method !== 'POST') {
    throw new Error('405: Method Not Allowed', {
      cause: trimReq(req),
    })
  }

  const { event, collection, key } = req.body

  if (
    !['books', 'articles'].includes(collection) ||
    !['items.create', 'items.update', 'items.delete'].includes(event)
  ) {
    throw new Error('400: Bad Request', { cause: trimReq(req) })
  }

  // it seems Directus emit 'items.create' event with singular `key` only, otherwise crashing this to tell myself to fix this
  if (event === 'items.create' && typeof key !== 'string') {
    throw new Error('500: got "items.create" without "key"', {
      cause: trimReq(req),
    })
  }
}
