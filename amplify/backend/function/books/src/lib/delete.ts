import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { BookDocument } from '@lily-bookshop/schemas'
import type { MongoClient } from 'mongodb'

import * as AWS from 'aws-sdk'
import { ObjectId } from 'mongodb'

import { getById, getByIds } from './get'

export async function DELETE(
  client: MongoClient,
  event: APIGatewayEvent
): Promise<Partial<APIGatewayProxyResult>> {
  const json = JSON.parse(event.body)

  /**
   * 1. maybe restrict DELETE to certain user group?
   * 2. delete the `thumbnail` uploaded to S3 too
   */
  if (json.id) {
    const book = await getById(client, json.id)
    const result = await deleteOne(client, json.id)

    if (book.thumbnail) {
      /**
       * TODO:
       * If failed to delete images of the book:
       * - create a scheduled lambda to regularly clean up unused images?
       * - revert the delete then throw error?
       */
      await deletePublicObjects([book.thumbnail])
    }

    return {
      body: JSON.stringify({ result }),
    }
  }

  if (json.ids) {
    const keys = (await getByIds(client, json.ids))
      .map((b) => b.thumbnail)
      .filter((t) => !!t)
    const result = await deleteMany(client, json.ids)

    if (keys.length) {
      await deletePublicObjects(keys)
    }

    return {
      body: JSON.stringify({ result }),
    }
  }

  return {
    statusCode: 400,
  }
}

async function deleteOne(client: MongoClient, id: string) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .deleteOne({ _id: new ObjectId(id) })
}

async function deleteMany(client: MongoClient, ids: string[]) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    })
}

async function deletePublicObjects(keys: string[]) {
  const s3 = new AWS.S3()

  try {
    await s3
      .deleteObjects({
        Bucket: process.env.STORAGE_S3LILYBOOKSHOPSTORAGE135156F8_BUCKETNAME,
        Delete: {
          Objects: keys.map((t) => ({ Key: 'public/' + t })),
        },
      })
      .promise()
  } catch (err) {
    console.error(err)
  }
}
