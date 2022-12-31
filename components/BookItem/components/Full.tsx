import type { BookItemProps } from '../types'

import { Badge, Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

import { Kvp } from '../../Kvp'
import { Section } from '../../Section'
import { Thumbnail } from './Thumbnail'

export interface FullProps extends Omit<BookItemProps, 'variant' | 'price'> {
  priceLabel?: string
}

export const Full = ({
  book: {
    title,
    subtitle,
    authors,
    aboutTheAuthor,
    publisher,
    publishedDate,
    description,
    ISBN_13,
    ISBN_10,
    pageCount,
    categories,
    thumbnail,
    language,
    storageLocation,
    quantity,
    highlightOrder,
  },
  priceLabel,
  ...linkBoxProps
}: FullProps): JSX.Element => {
  const { t } = useTranslation('common')

  return (
    <Box as="article" display="flex" flexDir="row" gap={4} {...linkBoxProps}>
      <Box w={[125, 150, 170]}>
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
          <Heading as="h1">{title}</Heading>

          {subtitle && <Text>{subtitle}</Text>}

          {authors && <Text>{authors.join(', ')}</Text>}
        </Box>

        <Flex wrap="wrap" gap={1}>
          {typeof highlightOrder === 'number' && (
            // probably better to look into how to theme this and the scenes probably https://chakra-ui.com/docs/styled-system/theme
            <Badge color="9A5B5F" bgColor="var(--highlight-theme)">
              {t('book-detailed-page.highlight-badge')}
            </Badge>
          )}

          {language && <Badge>{t(`language.${language}`)}</Badge>}

          {categories?.map((c) => (
            <Badge key={c}>{c}</Badge>
          ))}

          {/* for reference */}
          {/* <Badge as={NextLink} href="/">
              {t('book-detailed-page.highlight-badge')}
            </Badge> */}
        </Flex>

        <SimpleGrid columns={[1, 1, 2, 3]} gap={2}>
          {[
            { caption: 'price-label', v: priceLabel },
            { caption: 'quantity', v: quantity },
            { caption: 'storage-location', v: storageLocation },
            { caption: 'publisher', v: publisher },
            { caption: 'published-date', v: publishedDate },
            { caption: 'ISBN_13', v: ISBN_13, useBadge: true },
            { caption: 'ISBN_10', v: ISBN_10, useBadge: true },
            { caption: 'page-count', v: pageCount },
          ].map(({ caption, v, useBadge }) => (
            <Kvp
              key={caption}
              k={t(`book-detailed-page.${caption}`)}
              useBadge={useBadge}
            >
              {v}
            </Kvp>
          ))}
        </SimpleGrid>

        <Section heading={t('book-detailed-page.description')}>
          {description}
        </Section>

        <Section heading={t('book-detailed-page.about-the-author')}>
          {aboutTheAuthor}
        </Section>
      </Box>
    </Box>
  )
}
