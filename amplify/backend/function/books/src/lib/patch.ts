import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { BookDocument } from '@lily-bookshop/schemas'
import type { MongoClient } from 'mongodb'

import { BookDocumentSchema } from '@lily-bookshop/schemas'
import { ObjectId } from 'mongodb'

import { getUserInfo } from './utils'

export async function PATCH(
  client: MongoClient,
  event: APIGatewayEvent
): Promise<Partial<APIGatewayProxyResult>> {
  const { book, id, ids } = JSON.parse(event.body)

  if (!book || (!id && !ids)) {
    return {
      statusCode: 404,
    }
  }

  const { userSub } = getUserInfo(event)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - only validate only given properties because this is a `PATCH` request, and the `book` can be partial
  const partialBookDocumentSchema = BookDocumentSchema.pick(Object.keys(book))

  const cleanPartialBook = partialBookDocumentSchema.validateSync(
    {
      ...book,
      user_updated: userSub,
      date_updated: new Date().getTime(),
    },
    { stripUnknown: true, strict: true }
  )

  throw new Error('testing')

  if (id) {
    const result = await updateOne(client, id, cleanPartialBook)

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
      cleanPartialBook
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
  book: Partial<BookDocument>
) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .updateOne({ _id: new ObjectId(id) }, { $set: book })
}

async function updateMany(
  client: MongoClient,
  ids: string[],
  book: Partial<BookDocument>
) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .updateMany(
      { _id: { $in: ids.map((id) => new ObjectId(id)) } },
      { $set: book }
    )
}
