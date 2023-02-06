import type { NewBook } from './types'

export const INITIAL_BOOK: NewBook = {
  status: 'draft',
  title: '',
  authors: [],
  categories: [],
  quantity: 1,
}
