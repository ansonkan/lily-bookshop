import type { BookItemProps } from './types'

import { Base, Detailed, Full } from './components'

export const BookItem = ({
  book,
  variant = 'base',
  ...others
}: BookItemProps): JSX.Element => {
  const { price, currency = 'HKD' } = book

  // `navigator.language` doesn't exist on the server side, so let's use `en-GB` for now
  const priceLabel = price
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency,
      }).format(price)
    : undefined

  if (variant === 'full') {
    return <Full priceLabel={priceLabel} {...others} book={book} />
  }

  if (variant === 'detailed') {
    return <Detailed priceLabel={priceLabel} {...others} book={book} />
  }

  return <Base priceLabel={priceLabel} {...others} book={book} />
}
