import Image from 'next/image'
import NextLink from 'next/link'
import {
  Text,
  AspectRatio,
  VStack,
  Link,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'

import placeholderImageSrc from 'public/placeholder-image.png'

export interface Price {
  amount: number
  currencyCode: string
}

export interface BookProps {
  title: string
  authors: string[]
  price: Price
  detailsLink: string
  imageLink?: string
}

export const Book = ({
  title,
  authors,
  price,
  detailsLink,
  imageLink,
}: BookProps): JSX.Element => {
  // `navigator.language` doesn't exist on the server side, so let's use `en-GB` for now
  const priceLabel = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(price.amount)

  return (
    <LinkBox as="article">
      <VStack spacing={2}>
        <AspectRatio ratio={1 / 1.5} width="full" maxW={[150, 200]}>
          <Image
            src={imageLink ?? placeholderImageSrc}
            alt={`Thumbnail of ${title}`}
            fill={true}
            placeholder="blur"
          />
        </AspectRatio>

        <LinkOverlay as={NextLink} href={detailsLink}>
          <Text as="b" fontSize="large">
            {title}
          </Text>
        </LinkOverlay>

        <Text>{authors.join(', ')}</Text>

        <Text>{priceLabel}</Text>
      </VStack>
    </LinkBox>
  )
}
