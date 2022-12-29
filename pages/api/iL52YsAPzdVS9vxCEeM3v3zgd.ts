// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { ObjectId } from 'mongodb'

import clientPromise from 'utils/mongodb'

// This endpoint is to sync Directus items to MongoDB Atlas because MongoDB Atlas is needed for the free text search
// Could use https://webhook.site/#!/ to test Directus webhook payload
export default async function handler(
  { headers, method, body }: NextApiRequest,
  res: NextApiResponse
) {
  if (
    headers['directus-webhook'] !==
    process.env.DIRECTUS_WEBHOOK_SYNC_DB_AUTH_HEADER
  ) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }

  if (method !== 'POST') {
    res.status(405).send({ message: 'Method Not Allowed' })
    return
  }

  try {
    const { event, collection, keys, key, payload } = body

    if (
      !['books', 'articles'].includes(collection) ||
      !['items.create', 'items.update', 'items.delete'].includes(event)
    ) {
      res.status(400).send({ message: 'Bad Request' })
      return
    }

    const client = await clientPromise
    const dbCollection = client.db('bookshop').collection(collection)

    switch (event) {
      case 'items.create':
        await dbCollection.insertOne({
          _id: new ObjectId(key),
          ...payload,
        })
        break

      case 'items.update':
        if (keys) {
          await dbCollection.updateMany(
            {
              _id: { $in: keys.map((k: string) => new ObjectId(k)) },
            },
            { $set: payload }
          )
        } else {
          await dbCollection.updateOne(
            { _id: new ObjectId(key) },
            { $set: payload }
          )
        }
        break

      case 'items.delete':
        if (keys) {
          await dbCollection.deleteMany({
            _id: { $in: keys.map((k: string) => new ObjectId(k)) },
          })
        } else {
          await dbCollection.deleteOne({ _id: new ObjectId(key) })
        }
        break
    }

    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false })
  }
}
