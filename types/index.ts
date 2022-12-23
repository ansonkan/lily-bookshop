export interface Price {
  amount: number
  currencyCode: string
}

export interface Book {
  id: string
  title: string
  authors: string[]
  price: Price
  description: string
  imageLink?: string
}
