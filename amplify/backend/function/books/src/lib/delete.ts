import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { BookDocument } from '@lily-bookshop/schemas'
import type { MongoClient } from 'mongodb'

import * as AWS from 'aws-sdk'
import { ObjectId } from 'mongodb'
import { captureException } from '@sentry/serverless'

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
    const objectKeys = [book.thumbnail, ...(book.other_photos || [])].filter(
      (key) => !!key
    )

    const result = await deleteOne(client, json.id)

    if (objectKeys.length) {
      /**
       * TODO:
       * If failed to delete images of the book:
       * - create a scheduled lambda to regularly clean up unused images?
       * - revert the delete then throw error?
       */
      await deletePublicObjects(objectKeys)
    }

    return {
      body: JSON.stringify({ result }),
    }
  }

  if (json.ids) {
    const objectKeys = (await getByIds(client, json.ids))
      .map((b) => [b.thumbnail, ...(b.other_photos || [])])
      .flat()
      .filter((key) => !!key)

    const result = await deleteMany(client, json.ids)

    if (objectKeys.length) {
      await deletePublicObjects(objectKeys)
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
    captureException(err)
  }
}
