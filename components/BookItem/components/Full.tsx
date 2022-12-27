import type { BookItemProps } from '../types'

import { Box, Heading, Link, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'

import { Thumbnail } from './Thumbnail'

export interface FullProps extends Omit<BookItemProps, 'variant' | 'price'> {
  priceLabel: string
}

export const Full = ({
  title,
  authors,
  description,
  priceLabel,
  detailsLink,
  imageLink,
  noOfLines,
  ...linkBoxProps
}: FullProps): JSX.Element => {
  const { t } = useTranslation('common')

  return (
    <Box as="article" display="flex" flexDir="row" gap={4} {...linkBoxProps}>
      <Box w={[125, 150, 200]}>
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
          <Link as={NextLink} href={detailsLink}>
            <Heading as="h1">{title}</Heading>
          </Link>
          <Text>{authors.join(', ')}</Text>
        </Box>

        <Text as="b">{priceLabel}</Text>

        <VStack alignItems="flex-start" noOfLines={noOfLines}>
          <Heading size="md">{t('book-detailed-page.description')}</Heading>

          {description.split('\n').map((paragraph, i) => (
            <Text fontSize="small" key={i}>
              {paragraph}
            </Text>
          ))}
        </VStack>
      </Box>
    </Box>
  )
}
