// TODO: create a separated eslint config to lambdas instead because this `no-console` rule is coming from the config file for the FE
/* eslint-disable no-console */
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
  const s3 = new AWS.S3()

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
      try {
        await s3
          .deleteObject({
            Bucket:
              process.env.STORAGE_S3LILYBOOKSHOPSTORAGE135156F8_BUCKETNAME,
            Key: book.thumbnail,
          })
          .promise()
      } catch (err) {
        console.error(err)
      }
    }

    return {
      body: JSON.stringify({ result }),
    }
  }

  if (json.ids) {
    const books = await getByIds(client, json.ids)
    const result = await deleteMany(client, json.ids)

    try {
      await s3
        .deleteObjects({
          Bucket: process.env.STORAGE_S3LILYBOOKSHOPSTORAGE135156F8_BUCKETNAME,
          Delete: {
            Objects: books
              .map((b) => b.thumbnail)
              .filter((t) => !!t)
              .map((t) => ({ Key: t })),
          },
        })
        .promise()
    } catch (err) {
      console.error(err)
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
