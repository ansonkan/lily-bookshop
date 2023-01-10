import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { BookDocument } from '@lily-bookshop/schemas'
import type { MongoClient } from 'mongodb'

import { ObjectId } from 'mongodb'

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
    return {
      body: JSON.stringify({
        result: await deleteOne(client, json.id),
      }),
    }
  }

  if (json.ids) {
    return {
      body: JSON.stringify({
        result: await deleteMany(client, json.ids),
      }),
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
