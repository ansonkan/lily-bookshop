import type { Book } from 'types'
import type { LinkBoxProps } from '@chakra-ui/react'

import { AspectRatio, Box, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import Image from 'next/image'
import NextLink from 'next/link'

import placeholderImageSrc from 'public/placeholder-image.png'

export interface BookItemProps
  extends Omit<LinkBoxProps, 'id' | 'title'>,
    Book {
  detailsLink: string
}

export const BookItem = ({
  title,
  authors,
  price,
  detailsLink,
  imageLink,
  ...linkBoxProps
}: BookItemProps): JSX.Element => {
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

      <Box w="full" flexGrow={1} display="flex" flexDirection="column">
        <LinkOverlay as={NextLink} href={detailsLink}>
          <Text as="b">{title}</Text>
        </LinkOverlay>
        <Text fontSize="small">{authors.join(', ')}</Text>
        <Text as="b" alignSelf="end" mt="auto">
          {priceLabel}
        </Text>
      </Box>
    </LinkBox>
  )
}
