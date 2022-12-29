const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const URL = {
  listBooks: 'items/Books',
  getCollectionBooks: 'collections/Books',
  listBooksFields: 'fields/Books',
  listFields: 'fields/Books',
}

main()

async function main() {
  try {
    // const result = await fetch(process.env.DIRECTUS_URL + 'files/import', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     url: 'http://books.google.com/books/content?id=XhQ5XsFcpGIC&printsec=frontcover&img=1&source=gbs_api',
    //     data: {
    //       title: 'testing',
    //     },
    //   }),
    // })

    const result = await fetch(
      process.env.DIRECTUS_URL + URL.listFields,
      // '/50540047-7fa4-4d9f-b2eb-fb62891d971d',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
        },
      }
    )

    const json = await result.json()

    fs.writeFileSync(
      path.join(__dirname, 'data', 'books-fields.json'),
      JSON.stringify(json)
    )
  } catch (error) {
    console.error(error)
  }
}
