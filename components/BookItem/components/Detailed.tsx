import type { BookItemProps } from '../types'

import { Box, LinkBox, LinkOverlay, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useMemo } from 'react'

import { Thumbnail } from './Thumbnail'

export interface DetailedProps
  extends Omit<BookItemProps, 'variant' | 'price'> {
  priceLabel?: string
  descriptionWorkCount?: number
}

export const Detailed = ({
  book: { title, subtitle, authors, description, thumbnail },
  priceLabel,
  detailsLink,
  descriptionWorkCount = 100,
  ...linkBoxProps
}: DetailedProps): JSX.Element => {
  const shortDescription = useMemo(
    () =>
      description
        ? description
            .split(' ')
            .filter((w) => !!w)
            .splice(0, descriptionWorkCount)
            .join(' ') + '...'
        : undefined,
    [description, descriptionWorkCount]
  )

  return (
    <LinkBox
      as="article"
      display="flex"
      flexDir="row"
      gap={2}
      {...linkBoxProps}
    >
      <Box w={[125, 130]}>
        <Thumbnail src={thumbnail} bookTitle={title} />
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

            {subtitle && (
              <Text as="span" fontSize="small">
                {' ' + subtitle}
              </Text>
            )}
          </LinkOverlay>

          {authors && <Text fontSize="small">{authors.join(', ')}</Text>}
        </Box>

        {shortDescription && (
          <VStack alignItems="flex-start">
            {shortDescription.split('\n').map((paragraph, i) => (
              <Text fontSize="small" key={i}>
                {paragraph}
              </Text>
            ))}
          </VStack>
        )}

        {priceLabel && (
          <Text as="b" alignSelf="end">
            {priceLabel}
          </Text>
        )}
      </Box>
    </LinkBox>
  )
}
