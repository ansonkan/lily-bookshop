import type { Document, WithId } from 'mongodb'
import type { APIGatewayEvent } from 'aws-lambda'
import type { BookDocument } from '@lily-bookshop/schemas'
import type { MongoClient } from 'mongodb'

export const docIdToString = <T extends Document>({
  _id,
  ...others
}: WithId<T>) => ({ id: _id.toString(), ...others })

const IDP_REGEX = /.*\/.*,(.*)\/(.*):CognitoSignIn:(.*)/

export const getUserInfo = ({ requestContext }: APIGatewayEvent) => {
  const [, , userPoolId, userSub] =
    requestContext.identity.cognitoAuthenticationProvider.match(IDP_REGEX)

  return {
    userPoolId,
    userSub,
  }
}

export const matchISBN = async (client: MongoClient, books: BookDocument[]) => {
  const isbnList = books
    .map((b) => [b.ISBN_10, b.ISBN_13])
    .flat()
    .filter((id) => !!id)

  if (!isbnList.length) {
    return []
  }

  const matches = await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .find({
      $or: [{ ISBN_10: { $in: isbnList } }, { ISBN_13: { $in: isbnList } }],
    })
    .toArray()

  return matches.map((m) => docIdToString(m))
}
