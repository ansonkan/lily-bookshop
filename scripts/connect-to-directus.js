const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const URL = {
  listBooks: 'items/Books',
  getCollectionBooks: 'collections/Books',
  listBooksFields: 'fields/Books',
}

main()

async function main() {
  try {
    const result = await fetch(process.env.DIRECTUS_URL + 'files/import', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
      },
      body: JSON.stringify({
        url: 'http://books.google.com/books/content?id=XhQ5XsFcpGIC&printsec=frontcover&img=1&source=gbs_api',
        data: {
          title: 'testing',
        },
      }),
    })

    const json = await result.json()

    console.log(JSON.stringify(json, null, 2))
  } catch (error) {
    console.error(error)
  }
}
