import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import type { Document, MongoClient, Sort, WithId } from 'mongodb'
import type { BookDocument } from '@lily-bookshop/schemas'

import * as AWS from 'aws-sdk'
import { ObjectId } from 'mongodb'

import { docIdToString } from './utils'

export async function GET(
  client: MongoClient,
  event: APIGatewayEvent
): Promise<Partial<APIGatewayProxyResult>> {
  // `proxy` is a default catch-all parameter in `/books/{proxy+}`
  const id = event.pathParameters?.proxy

  const {
    q,
    // 1 based page
    page,
    limit,
    relatedTo,
    sort,
    sortOnlyExist,
    autocomplete,
    // try to converts object id to link directly here, rather than request object link in the FE with `useEffect`, see if this solve the cache MISS issue
    useObjectLink,
    publishedOnly,
  } = event.queryStringParameters || {}

  if (id) {
    /**
     * `proxy` could be `property1/property2/property3` or more
     * but let's assume it would be a normal book ID
     */
    const book = await getById(client, id, publishedOnly === '1')

    if (book) {
      const feBook = docIdToString(book)

      return {
        body: JSON.stringify({
          book: useObjectLink ? (await populateS3Links([feBook]))[0] : feBook,
        }),
      }
    }

    return {
      statusCode: 404,
    }
  }

  const pageInt = page ? parseInt(page) : 1
  const limitInt = limit ? parseInt(limit) : 10

  if (autocomplete) {
    return {
      body: JSON.stringify({
        options: await autocompleteTitle(client, {
          query: autocomplete,
          limit: limitInt,
          publishedOnly: publishedOnly === '1',
        }),
      }),
      headers: {
        'Cache-Control': 'public, s-maxage=86400, max-age=86400',
      },
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
        publishedOnly: publishedOnly === '1',
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
        publishedOnly: publishedOnly === '1',
      })
    }

    return list(client, {
      page: pageInt,
      limit: limitInt,
      sort: sortStage,
      sortOnlyExist: sortOnlyExist === '1',
      publishedOnly: publishedOnly === '1',
    })
  })()

  const { books = [], meta } = result[0] || {}

  const feBooks = books.map((b: WithId<BookDocument>) => docIdToString(b))

  return {
    body: JSON.stringify({
      books: useObjectLink ? await populateS3Links(feBooks) : feBooks,
      total: meta?.[0]?.count.total || 0,
      query: {
        q,
        page: pageInt,
        limit: limitInt,
      },
    }),
  }
}

export async function getById(
  client: MongoClient,
  id: string,
  publishedOnly?: boolean
) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .findOne(
      publishedOnly
        ? { _id: new ObjectId(id), status: 'published' }
        : { _id: new ObjectId(id) }
    )
}

export async function getByIds(
  client: MongoClient,
  ids: string[],
  publishedOnly?: boolean
) {
  return await client
    .db('bookshop')
    .collection<BookDocument>('books')
    .find(
      publishedOnly
        ? {
            _id: {
              $in: ids.map((id) => new ObjectId(id)),
              status: 'published',
            },
          }
        : { _id: { $in: ids.map((id) => new ObjectId(id)) } }
    )
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
  publishedOnly?: boolean
}

async function search(
  client: MongoClient,
  { query, page, limit, sort, sortOnlyExist, publishedOnly }: SearchOptions
) {
  const skip = (page - 1) * limit

  const stages: Document[] = [
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
  ]

  if (publishedOnly) {
    stages.push({ $match: { status: 'published' } })
  }

  stages.push({
    $facet: {
      books: [
        ...(sort ? getSortStages(sort, sortOnlyExist) : []),
        { $skip: skip },
        { $limit: limit },
      ],
      meta: [{ $replaceWith: '$$SEARCH_META' }, { $limit: 1 }],
    },
  })

  return (await client
    .db('bookshop')
    .collection('books')
    .aggregate(stages)
    .toArray()) as BookResults
}

interface ListRelatedOptions {
  relatedTo: string // book _id
  page: number
  limit: number
  publishedOnly?: boolean
}

async function listRelated(
  client: MongoClient,
  { relatedTo, page, limit, publishedOnly }: ListRelatedOptions
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
          _id: {
            $ne: new ObjectId(targetBook._id),
          },
          ...(publishedOnly ? { status: 'published' } : {}),
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
  publishedOnly?: boolean
}

async function list(
  client: MongoClient,
  { page, limit, sort, sortOnlyExist, publishedOnly }: ListOptions
) {
  const skip = (page - 1) * limit

  const stages: Document[] = [
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
  ]

  if (publishedOnly) {
    stages.unshift({ $match: { status: 'published' } })
  }

  return (await client
    .db('bookshop')
    .collection('books')
    .aggregate(stages)
    .toArray()) as BookResults
}

interface AutocompleteTitleOptions {
  query: string
  limit: number
  publishedOnly?: boolean
}

async function autocompleteTitle(
  client: MongoClient,
  { query, limit, publishedOnly }: AutocompleteTitleOptions
) {
  const stages: Document[] = [
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
  ]

  if (publishedOnly) {
    stages.push({
      $match: { status: 'published' },
    })
  }

  stages.push(...[{ $limit: limit }, { $project: { _id: 0, title: 1 } }])

  return (
    await client.db('bookshop').collection('books').aggregate(stages).toArray()
  ).map((item) => item.title) as string[]
}

async function populateS3Links(books: BookDocument[]) {
  const keys = books
    .map((b) => [b.thumbnail, ...(b.other_photos || [])])
    .flat()
    .filter((t) => !!t)

  const keyToLinkMap = await s3KeysToLinks(keys)
  books.forEach((b) => {
    b.thumbnail = keyToLinkMap.get(b.thumbnail)
    b.other_photos = b.other_photos
      ?.map((key) => keyToLinkMap.get(key))
      .filter((k) => !!k)
  })

  return books
}

async function s3KeysToLinks(keys: string[]) {
  const s3 = new AWS.S3()
  const keyToLinkMap = new Map<string, string>()

  const results = await Promise.allSettled(
    keys.map((k) =>
      s3
        .getSignedUrlPromise('getObject', {
          Bucket: process.env.STORAGE_S3LILYBOOKSHOPSTORAGE135156F8_BUCKETNAME,
          Key: 'public/' + k,
          Expires: 86400,
        })
        .then((link) => ({ link, key: k }))
    )
  )

  results.forEach((r) => {
    if (r.status === 'fulfilled') {
      keyToLinkMap.set(r.value.key, r.value.link)
    }
  })

  return keyToLinkMap
}
