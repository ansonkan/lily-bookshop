import type { BookItemProps } from '../types'

import { Box, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

import { Thumbnail } from './Thumbnail'

export interface BaseProps extends Omit<BookItemProps, 'variant' | 'price'> {
  priceLabel?: string
}

export const Base = ({
  book: { title, subtitle, thumbnail, authors },
  priceLabel,
  detailsLink,
  ...linkBoxProps
}: BaseProps): JSX.Element => (
  <LinkBox
    as="article"
    display="flex"
    flexDir="column"
    gap={4}
    {...linkBoxProps}
  >
    <Thumbnail src={thumbnail ?? undefined} bookTitle={title} />

    <Box w="full" flexGrow={1} display="flex" flexDirection="column">
      <LinkOverlay as={NextLink} href={detailsLink}>
        <Text as="b">{title}</Text>
      </LinkOverlay>

      {subtitle && <Text fontSize="sm">{subtitle}</Text>}

      {authors && <Text fontSize="sm">{authors.join(', ')}</Text>}

      <Text as="b" alignSelf="end" mt="auto">
        {priceLabel}
      </Text>
    </Box>
  </LinkBox>
)
