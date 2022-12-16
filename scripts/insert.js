const fs = require('fs')
const path = require('path')
const mongodb = require('mongodb')

require('dotenv').config({
  path: path.join(__dirname, '..', '..', '.env.local'),
})

insertFakeBooks()

async function insertFakeBooks() {
  const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'books.json')))

  const MongoClient = mongodb.MongoClient

  const client = await MongoClient.connect(process.env.MONGODB_URI ?? '')
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
