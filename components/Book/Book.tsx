import type { LinkBoxProps } from '@chakra-ui/react'

import { AspectRatio, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import Image from 'next/image'
import NextLink from 'next/link'

import placeholderImageSrc from 'public/placeholder-image.png'

export interface Price {
  amount: number
  currencyCode: string
}

export interface BookProps extends LinkBoxProps {
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
  ...linkBoxProps
}: BookProps): JSX.Element => {
  // `navigator.language` doesn't exist on the server side, so let's use `en-GB` for now
  const priceLabel = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(price.amount)

  return (
    <LinkBox
      as="article"
      display="flex"
      flexDir="column"
      gap={2}
      {...linkBoxProps}
    >
      <AspectRatio
        ratio={1 / 1.5}
        w="full"
        bgColor="gray.100"
        rounded="3xl"
        overflow="hidden"
      >
        <Image
          src={imageLink ?? placeholderImageSrc}
          alt={`Thumbnail of ${title}`}
          fill={true}
          placeholder="blur"
        />
      </AspectRatio>

      <LinkOverlay
        as={NextLink}
        href={detailsLink}
        w="full"
        flexGrow={1}
        display="flex"
        flexDirection="column"
      >
        <Text as="b">{title}</Text>
        <Text fontSize="small">{authors.join(', ')}</Text>
        <Text as="b" alignSelf="end" mt="auto">
          {priceLabel}
        </Text>
      </LinkOverlay>
    </LinkBox>
  )
}
