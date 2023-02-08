import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { BookCategoryDocument, BookDocument } from '@lily-bookshop/schemas'
import type { MongoClient } from 'mongodb'

import { ObjectId } from 'mongodb'

export async function DELETE(
  client: MongoClient,
  event: APIGatewayEvent
): Promise<Partial<APIGatewayProxyResult>> {
  const json = JSON.parse(event.body)

  if (json.id) {
    const result = await deleteOne(client, json.id)

    await cleanupBooks(client, [json.id])

    // TODO: remove this category from all books

    return {
      body: JSON.stringify({ result }),
    }
  }

  if (json.ids) {
    const result = await deleteMany(client, json.ids)

    await cleanupBooks(client, json.ids)

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
    .collection<BookCategoryDocument>('book_categories')
    .deleteOne({ _id: new ObjectId(id) })
}

async function deleteMany(client: MongoClient, ids: string[]) {
  return await client
    .db('bookshop')
    .collection<BookCategoryDocument>('book_categories')
    .deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    })
}

async function cleanupBooks(client: MongoClient, ids: string[]) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .updateMany({}, { $pull: { categories: ids } })
}
