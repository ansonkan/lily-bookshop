import type { BooksCreateFormik, NewBook } from './types'

export const INITIAL_BOOK: NewBook = {
  status: 'draft',
  title: '',
  authors: [],
  categories: [],
  quantity: 1,
}

export const INITIAL_BOOKS: BooksCreateFormik = {
  books: [INITIAL_BOOK],
}
