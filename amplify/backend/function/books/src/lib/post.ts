import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { BookDocument } from '@lily-bookshop/schemas'
import type { MongoClient } from 'mongodb'

import { BookDocumentSchema } from '@lily-bookshop/schemas'

import { getUserInfo } from './utils'

export async function POST(
  client: MongoClient,
  event: APIGatewayEvent
): Promise<Partial<APIGatewayProxyResult>> {
  const { book, books } = JSON.parse(event.body)

  const { userSub } = getUserInfo(event)
  const now = new Date().getTime()

  const meta = {
    user_created: userSub,
    date_created: now,
    user_updated: userSub,
    date_updated: now,
  }

  if (book) {
    const cleanBook = BookDocumentSchema.validateSync(
      { ...book, ...meta },
      { stripUnknown: true, strict: true }
    )

    const result = await insertOne(client, cleanBook)

    return {
      body: JSON.stringify({
        result: {
          ...result,
          insertedId: result.insertedId.toString(),
        },
      }),
    }
  }

  if (books) {
    const cleanBooks = books.map((book: Partial<BookDocument>) =>
      BookDocumentSchema.validateSync(
        { ...book, ...meta },
        { stripUnknown: true, strict: true }
      )
    )

    const result = await insertMany(client, cleanBooks)

    return {
      body: JSON.stringify({
        result: {
          ...result,
          insertedIds: Object.values(result.insertedIds).map((id) =>
            id.toString()
          ),
        },
      }),
    }
  }

  return {
    statusCode: 400,
  }
}

async function insertOne(client: MongoClient, book: BookDocument) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .insertOne(book)
}

async function insertMany(client: MongoClient, books: BookDocument[]) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .insertMany(books)
}
