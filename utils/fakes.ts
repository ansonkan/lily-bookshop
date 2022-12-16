import type { RealBook } from '@types'

import { faker } from '@faker-js/faker'

export const fakeBook = (): RealBook => {
  const id = faker.datatype.uuid()

  return {
    id,
    title: faker.commerce.productName(),
    authors: many(
      faker.name.fullName,
      faker.datatype.number({ min: 1, max: 2 })
    ),
    price: {
      amount: faker.datatype.number({ min: 20, max: 500 }),
      currencyCode: 'HKD',
    },
    detailsLink: `/book/${id}`,
  }
}

export const many = <T>(fn: () => T, quantity = 10): T[] => {
  const results: T[] = []

  for (let i = 0; i < quantity; i++) {
    results.push(fn())
  }

  return results
}
