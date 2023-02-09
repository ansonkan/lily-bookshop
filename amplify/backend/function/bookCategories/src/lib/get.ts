import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { MongoClient, WithId } from 'mongodb'
import type { BookCategoryDocument } from '@lily-bookshop/schemas'

import { ObjectId } from 'mongodb'

import { docIdToString } from './utils'

export async function GET(
  client: MongoClient,
  event: APIGatewayEvent
): Promise<Partial<APIGatewayProxyResult>> {
  // `proxy` is a default catch-all parameter in `/books/{proxy+}`
  const id = event.pathParameters?.proxy

  if (id) {
    const category = await getById(client, id)

    if (category) {
      return {
        body: JSON.stringify({
          book_category: docIdToString(category),
        }),
      }
    }

    return {
      statusCode: 404,
    }
  }

  const result = await list(client)

  const book_categories = result.map((b: WithId<BookCategoryDocument>) =>
    docIdToString(b)
  )

  return {
    body: JSON.stringify({
      book_categories,
    }),
  }
}

export async function getById(client: MongoClient, id: string) {
  return await client
    .db('bookshop')
    .collection<BookCategoryDocument>('book_categories')
    .findOne({ _id: new ObjectId(id) })
}

export async function getByIds(client: MongoClient, ids: string[]) {
  return await client
    .db('bookshop')
    .collection<BookCategoryDocument>('book_categories')
    .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
    .toArray()
}

async function list(client: MongoClient) {
  return await client
    .db('bookshop')
    .collection<BookCategoryDocument>('book_categories')
    .find({})
    .toArray()
}
