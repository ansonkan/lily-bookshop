import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { BookCategoryDocument } from '@lily-bookshop/schemas'
import type { MongoClient } from 'mongodb'

import { BookCategoryDocumentSchema } from '@lily-bookshop/schemas'
import { ObjectId } from 'mongodb'

export async function PATCH(
  client: MongoClient,
  event: APIGatewayEvent
): Promise<Partial<APIGatewayProxyResult>> {
  const { bookCategory, id, ids } = JSON.parse(event.body)

  if (!bookCategory || (!id && !ids)) {
    return {
      statusCode: 404,
    }
  }

  const cleanCategory = BookCategoryDocumentSchema.validateSync(bookCategory, {
    stripUnknown: true,
    strict: true,
  })

  if (id) {
    const result = await updateOne(client, id, cleanCategory)

    return {
      body: JSON.stringify({
        result: {
          ...result,
          insertedId: result.upsertedId?.toString(),
        },
      }),
    }
  }

  if (ids) {
    const { acknowledged, matchedCount, modifiedCount } = await updateMany(
      client,
      ids,
      cleanCategory
    )

    return {
      body: JSON.stringify({
        result: {
          acknowledged,
          matchedCount,
          modifiedCount,
        },
      }),
    }
  }

  return {
    statusCode: 400,
  }
}

async function updateOne(
  client: MongoClient,
  id: string,
  cat: BookCategoryDocument
) {
  return await client
    .db('bookshop')
    .collection<BookCategoryDocument>('book_categories')
    .updateOne({ _id: new ObjectId(id) }, { $set: cat })
}

async function updateMany(
  client: MongoClient,
  ids: string[],
  cat: BookCategoryDocument
) {
  return await client
    .db('bookshop')
    .collection<BookCategoryDocument>('book_categories')
    .updateMany(
      { _id: { $in: ids.map((id) => new ObjectId(id)) } },
      { $set: cat }
    )
}
