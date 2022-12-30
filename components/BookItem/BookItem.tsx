import type { BookItemProps } from './types'

import { Base, Detailed, Full } from './components'

export const BookItem = ({
  price,
  currency = 'HKD',
  variant = 'base',
  ...others
}: BookItemProps): JSX.Element => {
  // `navigator.language` doesn't exist on the server side, so let's use `en-GB` for now
  const priceLabel = price
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency,
      }).format(price)
    : undefined

  if (variant === 'full') {
    return <Full priceLabel={priceLabel} {...others} />
  }

  if (variant === 'detailed') {
    return <Detailed priceLabel={priceLabel} {...others} />
  }

  return <Base priceLabel={priceLabel} {...others} />
}
