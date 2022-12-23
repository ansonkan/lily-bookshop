import type { BookItemProps } from '../types'

import { Box, LinkBox, LinkOverlay, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

import { Thumbnail } from './Thumbnail'

export interface DetailedProps
  extends Omit<BookItemProps, 'variant' | 'price'> {
  priceLabel: string
}

export const Detailed = ({
  title,
  authors,
  description,
  priceLabel,
  detailsLink,
  imageLink,
  ...linkBoxProps
}: DetailedProps): JSX.Element => (
  <LinkBox as="article" display="flex" flexDir="row" gap={2} {...linkBoxProps}>
    <Box w={[125, 150]}>
      <Thumbnail src={imageLink} bookTitle={title} />
    </Box>

    <Box
      w="full"
      flexGrow={1}
      display="flex"
      flexDirection="column"
      gap={[2, 4]}
    >
      <Box>
        <LinkOverlay as={NextLink} href={detailsLink}>
          <Text as="b">{title}</Text>
        </LinkOverlay>
        <Text fontSize="small">{authors.join(', ')}</Text>
      </Box>

      <VStack alignItems="flex-start">
        {description.split('\n').map((paragraph, i) => (
          <Text fontSize="small" key={i}>
            {paragraph}
          </Text>
        ))}
      </VStack>

      <Text as="b" alignSelf="end">
        {priceLabel}
      </Text>
    </Box>
  </LinkBox>
)
