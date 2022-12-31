import type { Book } from 'types'

import { faker } from '@faker-js/faker'

export const fakeBook = (): Book => {
  const id = faker.datatype.uuid()
  const randomNum = faker.datatype.number({ min: 0, max: 2 })

  return {
    directusId: id,
    status:
      randomNum === 0 ? 'published' : randomNum === 1 ? 'draft' : 'archived',
    user_created: faker.datatype.uuid(),
    date_created: faker.datatype.datetime().toISOString(),
    user_updated: faker.datatype.uuid(),
    date_updated: faker.datatype.datetime().toISOString(),
    title: faker.commerce.productName(),
    subtitle: faker.commerce.productName(),
    authors: many(
      faker.name.fullName,
      faker.datatype.number({ min: 1, max: 2 })
    ),
    aboutTheAuthor: faker.lorem.paragraphs(),
    publisher: faker.commerce.productName(),
    publishedDate: faker.datatype.datetime().toDateString(),
    description: faker.lorem.paragraphs(),
    ISBN_13: faker.random.alpha({ count: 13 }),
    ISBN_10: faker.random.alpha({ count: 10 }),
    pageCount: faker.datatype.number({ min: 1, max: 400 }),
    categories: many(
      faker.random.word,
      faker.datatype.number({ min: 0, max: 4 })
    ),
    // thumbnail: null,
    language: randomNum === 0 ? 'en' : randomNum === 1 ? 'zh' : 'ja',
    // googleBookLink: 'googleBookLink',
    storageLocation: faker.random.words(),
    quantity: faker.datatype.number({ min: 0, max: 2 }),
    highlightOrder: faker.datatype.number({ min: -10, max: 10 }),
    price: faker.datatype.number({ min: 20, max: 500 }),
    currency: 'HKD',
  }
}

export const many = <T>(fn: () => T, quantity = 10): T[] => {
  const results: T[] = []

  for (let i = 0; i < quantity; i++) {
    results.push(fn())
  }

  return results
}
