import { mutate } from 'swr'

export const mutateBooks = () =>
  mutate(
    (key) =>
      Array.isArray(key) &&
      typeof key[1] === 'string' &&
      key[1].startsWith('/books')
  )
