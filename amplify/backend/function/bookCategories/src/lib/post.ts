import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { BookCategoryDocument } from '@lily-bookshop/schemas'
import type { MongoClient } from 'mongodb'

import { BookCategoryDocumentSchema } from '@lily-bookshop/schemas'

export async function POST(
  client: MongoClient,
  event: APIGatewayEvent
): Promise<Partial<APIGatewayProxyResult>> {
  const { bookCategory, bookCategories } = JSON.parse(event.body)

  if (bookCategory) {
    const cleanBook = BookCategoryDocumentSchema.validateSync(bookCategory, {
      stripUnknown: true,
      strict: true,
    })

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

  if (bookCategories) {
    const cleanBooks = bookCategories.map(
      (cat: Partial<BookCategoryDocument>) =>
        BookCategoryDocumentSchema.validateSync(cat, {
          stripUnknown: true,
          strict: true,
        })
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

async function insertOne(client: MongoClient, cat: BookCategoryDocument) {
  return await client
    .db('bookshop')
    .collection<BookCategoryDocument>('book_categories')
    .insertOne(cat)
}

async function insertMany(client: MongoClient, cat: BookCategoryDocument[]) {
  return await client
    .db('bookshop')
    .collection<BookCategoryDocument>('book_categories')
    .insertMany(cat)
}
