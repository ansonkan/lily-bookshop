// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { AutocompleteBookResult, MongoDbBook } from 'types'
import type { NextApiRequest, NextApiResponse } from 'next'

import { MongoClient } from 'mongodb'
import { captureException } from '@sentry/nextjs'

const LIMIT = 10

// This endpoint is to sync Directus items to MongoDB Atlas because MongoDB Atlas is needed for the free text search
// Could use https://webhook.site/#!/ to test Directus webhook payload
export default async function handler(
  { query }: NextApiRequest,
  res: NextApiResponse<AutocompleteBookResult>
) {
  if (!process.env.MONGODB_URL_READ_WRITE) {
    throw new Error(
      'Invalid/Missing environment variable: "MONGODB_URL_READ_WRITE"'
    )
  }

  const client = new MongoClient(process.env.MONGODB_URL_READ_WRITE)

  try {
    if (!query.input) {
      throw new Error('400: Bad Request')
    }

    await client.connect()
    const booksColl = client.db('bookshop').collection<MongoDbBook>('books')

    const result = await booksColl
      .aggregate<AutocompleteBookResult['books'][number]>([
        {
          $search: {
            index: 'autocomplete',
            autocomplete: {
              query: query.input,
              path: 'title',
            },
          },
        },
        {
          $project: {
            _id: 0,
            title: 1,
            subtitle: 1,
            directusId: 1,
            authors: 1,
          },
        },
        { $limit: LIMIT },
      ])
      .toArray()

    res.status(200).json({ books: result })
  } catch (err) {
    captureException(err)
    res.status(500).json({ books: [] })
  } finally {
    await client.close()
  }
}
