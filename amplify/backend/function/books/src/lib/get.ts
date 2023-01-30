import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { Document, MongoClient, Sort, WithId } from 'mongodb'
import type { BookDocument } from '@lily-bookshop/schemas'

import { ObjectId } from 'mongodb'

import { docIdToString } from './utils'

export async function GET(
  client: MongoClient,
  event: APIGatewayEvent
): Promise<Partial<APIGatewayProxyResult>> {
  // `proxy` is a default catch-all parameter in `/books/{proxy+}`
  const id = event.pathParameters?.proxy

  if (id) {
    /**
     * `proxy` could be `property1/property2/property3` or more
     * but let's assume it would be a normal book ID
     */
    const book = await getById(client, id)

    if (book) {
      return {
        body: JSON.stringify({
          book: docIdToString(book),
        }),
      }
    }

    return {
      statusCode: 404,
    }
  }

  const {
    q,
    // 1 based page
    page,
    limit,
    relatedTo,
    sort,
    sortOnlyExist,
    autocomplete,
  } = event.queryStringParameters || {}

  const pageInt = page ? parseInt(page) : 1
  const limitInt = limit ? parseInt(limit) : 10

  if (autocomplete) {
    return {
      body: JSON.stringify({
        options: await autocompleteTitle(client, {
          query: autocomplete,
          limit: limitInt,
        }),
      }),
    }
  }

  const sortStage = sort
    ? sort
        .split(',')
        .map((str) => {
          // `order` should be either `1` (asc) or `-1` (desc)
          const [key, order] = str.split(':')
          return { key, order: parseInt(order) }
        })
        .reduce((acc, { key, order }) => {
          acc[key] = order
          return acc
        }, {} as Sort)
    : undefined

  const result = await (() => {
    if (q) {
      return search(client, {
        query: q,
        page: pageInt,
        limit: limitInt,
        sort: sortStage,
        sortOnlyExist: sortOnlyExist === '1',
      })
    }

    if (relatedTo) {
      /**
       * Better to refactor this by extending the ways to use `q`.
       * Could be something like https://developers.google.com/books/docs/v1/using#PerformingSearch
       */
      return listRelated(client, {
        relatedTo,
        page: pageInt,
        limit: limitInt,
      })
    }

    return list(client, {
      page: pageInt,
      limit: limitInt,
      sort: sortStage,
      sortOnlyExist: sortOnlyExist === '1',
    })
  })()

  const { books = [], meta } = result[0] || {}

  return {
    body: JSON.stringify({
      books: books.map((b: WithId<BookDocument>) => docIdToString(b)),
      total: meta?.[0]?.count.total || 0,
      query: {
        q,
        page: pageInt,
        limit: limitInt,
      },
    }),
  }
}

export async function getById(client: MongoClient, id: string) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .findOne({ _id: new ObjectId(id) })
}

export async function getByIds(client: MongoClient, ids: string[]) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
    .toArray()
}

type BookResults = Array<{
  books: WithId<BookDocument>[]
  meta: [{ count: { total: number } }]
}>

interface SearchOptions {
  query: string
  page: number
  limit: number
  sort?: Sort
  sortOnlyExist?: boolean
}

async function search(
  client: MongoClient,
  { query, page, limit, sort, sortOnlyExist }: SearchOptions
) {
  const skip = (page - 1) * limit

  return (await client
    .db('bookshop')
    .collection('books')
    .aggregate([
      {
        $search: {
          index: 'default',
          text: {
            query,
            path: {
              wildcard: '*',
            },
            fuzzy: {},
          },
          count: {
            type: 'total',
          },
        },
      },
      {
        $facet: {
          books: [
            ...(sort ? getSortStages(sort, sortOnlyExist) : []),
            { $skip: skip },
            { $limit: limit },
          ],
          meta: [{ $replaceWith: '$$SEARCH_META' }, { $limit: 1 }],
        },
      },
    ])
    .toArray()) as BookResults
}

interface ListRelatedOptions {
  relatedTo: string // book _id
  page: number
  limit: number
}

async function listRelated(
  client: MongoClient,
  { relatedTo, page, limit }: ListRelatedOptions
) {
  const targetBook = await getById(client, relatedTo)

  const searchShoulds: Record<string, unknown>[] = [
    {
      text: {
        query: targetBook.title.split(' ').filter((w) => !!w),
        path: {
          wildcard: '*',
        },
        fuzzy: {},
      },
    },
  ]

  if (targetBook.authors?.length) {
    searchShoulds.push({
      text: {
        query: targetBook.authors,
        path: 'authors',
      },
    })
  }

  if (targetBook.categories?.length) {
    searchShoulds.push({
      text: {
        query: targetBook.categories,
        path: 'categories',
        fuzzy: {},
      },
    })
  }

  const skip = (page - 1) * limit

  return (await client
    .db('bookshop')
    .collection('books')
    .aggregate([
      {
        $search: {
          index: 'default',
          compound: {
            should: searchShoulds,
          },
          count: {
            type: 'total',
          },
        },
      },
      {
        $match: {
          _id: { $ne: new ObjectId(targetBook._id) },
        },
      },
      {
        $facet: {
          books: [{ $skip: skip }, { $limit: limit }],
          meta: [{ $replaceWith: '$$SEARCH_META' }, { $limit: 1 }],
        },
      },
    ])
    .toArray()) as BookResults
}

function getSortStages(sort: Sort, sortOnlyExist?: boolean) {
  const stages: Document[] = [{ $sort: sort }]

  if (sortOnlyExist) {
    const keys = Object.keys(sort)
    stages.unshift({
      $match: keys.reduce((acc, cur) => {
        // ignore documents that have `null` sorting properties, because I think it makes more sense that way
        acc[cur] = { $ne: null }
        return acc
      }, {} as Document),
    })
  }

  return stages
}

interface ListOptions {
  page: number
  limit: number
  sort?: Sort
  sortOnlyExist?: boolean
}

async function list(
  client: MongoClient,
  { page, limit, sort, sortOnlyExist }: ListOptions
) {
  const skip = (page - 1) * limit

  return (await client
    .db('bookshop')
    .collection('books')
    .aggregate([
      {
        $facet: {
          books: [
            ...(sort ? getSortStages(sort, sortOnlyExist) : []),
            { $skip: skip },
            { $limit: limit },
          ],
          meta: [
            { $count: 'count' },
            // mimic the shape of `$$SEARCH_META`
            { $project: { count: { total: '$count' } } },
          ],
        },
      },
    ])
    .toArray()) as BookResults
}

interface AutocompleteTitleOptions {
  query: string
  limit: number
}

async function autocompleteTitle(
  client: MongoClient,
  { query, limit }: AutocompleteTitleOptions
) {
  return (
    await client
      .db('bookshop')
      .collection('books')
      .aggregate([
        {
          $search: {
            index: 'autocomplete',
            autocomplete: {
              query,
              path: 'title',
              fuzzy: {},
            },
          },
        },
        { $limit: limit },
        { $project: { _id: 0, title: 1 } },
      ])
      .toArray()
  ).map((item) => item.title) as string[]
}
