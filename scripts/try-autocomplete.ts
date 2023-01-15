import { MongoClient } from 'mongodb'
import path from 'node:path'

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

main()

async function main() {
  if (!process.env.MONGODB_URL_READ_ONLY)
    throw new Error('Connection string is missing!')

  let client: MongoClient | undefined
  try {
    client = new MongoClient(process.env.MONGODB_URL_READ_ONLY)
    const query = 'lov'

    const result = await client
      .db('bookshop')
      .collection('books')
      .aggregate([
        {
          $search: {
            index: 'autocomplete',
            autocomplete: {
              query,
              path: 'title',
            },
            // Read more about compound here:
            // https://docs.atlas.mongodb.com/reference/atlas-search/compound/
            // compound: {
            //   should: [
            //     {
            //       autocomplete: {
            //         query,
            //         path: 'title',
            //       },
            //     },
            //     {
            //       autocomplete: {
            //         query,
            //         path: 'subtitle',
            //       },
            //     },
            //     {
            //       autocomplete: {
            //         query,
            //         path: 'ISBN_13',
            //       },
            //     },
            //     {
            //       autocomplete: {
            //         query,
            //         path: 'ISBN_10',
            //       },
            //     },
            //   ],
            // },
          },
        },
        { $limit: 5 },
        // { $project: { _id: 0, title: 1, subtitle: 1, ISBN_13: 1, ISBN_10: 1 } },
        { $project: { _id: 0, title: 1 } },
      ])
      .toArray()

    console.log(JSON.stringify(result, null, 2))
  } finally {
    client?.close()
  }
}
