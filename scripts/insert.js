const fs = require('fs')
const path = require('path')
const mongodb = require('mongodb')

require('dotenv').config({
  path: path.join(__dirname, '..', '.env.local'),
})

// insertFakeBooks()

test()

async function test() {
  const client = await getClient()

  const result = await client
    .db('bookshop')
    .collection('books')
    .updateMany(
      {},
      { $pull: { categories: { $in: ['63e47799194f79e0b7a71996'] } } }
    )

  console.log('result: ', JSON.stringify(result, null, 2))
}

async function insertFakeBooks() {
  const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'books.json')))

  const client = await getClient()
  const db = client.db('bookshop')

  const size = 100
  let start = 0
  let end = start + size

  while (start < books.length) {
    const result = await db
      .collection('books')
      .insertMany(books.slice(start, end))

    console.log(
      `start: ${start}; insertedCount: ${result.insertedCount}; acknowledged: ${result.acknowledged}`
    )

    start = end
    end += size
  }

  console.log('DONE!!!', books.length)
}

async function getClient() {
  const MongoClient = mongodb.MongoClient

  return await MongoClient.connect(process.env.MONGODB_URL_READ_WRITE ?? '')
}
