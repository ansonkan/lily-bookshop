import type { BookItemProps } from '../types'

import {
  Badge,
  Box,
  HStack,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useMemo } from 'react'

import { Thumbnail } from './Thumbnail'

export interface DetailedProps
  extends Omit<BookItemProps, 'variant' | 'price'> {
  priceLabel?: string
  descriptionWorkCount?: number
}

export const Detailed = ({
  book: { title, subtitle, authors, description, thumbnail, ISBN_10, ISBN_13 },
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

  const Title = () => (
    <>
      <Text as="b">{title}</Text>

      {subtitle && <Text as="span">{' ' + subtitle}</Text>}
    </>
  )

  return (
    <LinkBox
      as="article"
      display="flex"
      flexDir="row"
      gap={4}
      w="full"
      {...linkBoxProps}
    >
      <Box w={[125, 130]}>
        <Thumbnail src={thumbnail ?? undefined} bookTitle={title} />
      </Box>

      <Box w="full" flexGrow={1} display="flex" flexDirection="column" gap={4}>
        <Box>
          {detailsLink ? (
            <LinkOverlay as={NextLink} href={detailsLink}>
              <Title />
            </LinkOverlay>
          ) : (
            <Title />
          )}

          {authors && <Text>{authors.join(', ')}</Text>}

          <HStack>
            {ISBN_10 && <Badge>{ISBN_10}</Badge>}
            {ISBN_13 && <Badge>{ISBN_13}</Badge>}
          </HStack>
        </Box>

        {shortDescription && (
          <VStack alignItems="flex-start">
            {shortDescription.split('\n').map((paragraph, i) => (
              <Text key={i}>{paragraph}</Text>
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
