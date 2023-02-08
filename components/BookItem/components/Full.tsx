/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { BookItemProps } from '../types'

import { Badge, Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import Image from 'next/image'
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
    about_the_authors,
    publisher,
    published_date,
    description,
    ISBN_13,
    ISBN_10,
    page_count,
    categories,
    thumbnail,
    language,
    storage_location,
    quantity,
    highlight_order,
    other_photos,
  },
  priceLabel,
  // Note: just to pick this out from `boxProps`
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  detailsLink,
  ...boxProps
}: FullProps): JSX.Element => {
  const { t } = useTranslation('common')

  return (
    <Box
      as="article"
      display="flex"
      flexDir="row"
      gap={4}
      w="full"
      {...boxProps}
    >
      <Box w={[125, 150, 170]}>
        <Thumbnail src={thumbnail ?? undefined} bookTitle={title} />
      </Box>

      <Box w="full" flexGrow={1} display="flex" flexDirection="column" gap={8}>
        <Box>
          <Heading as="h1">{title}</Heading>

          {subtitle && <Text>{subtitle}</Text>}

          {authors && <Text>{authors.join(', ')}</Text>}

          <Flex wrap="wrap" gap={2} mt={2}>
            {typeof highlight_order === 'number' && (
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
        </Box>

        <SimpleGrid columns={[1, 1, 2, 3]} gap={2}>
          {[
            { caption: 'price-label', v: priceLabel },
            { caption: 'quantity', v: quantity },
            { caption: 'storage-location', v: storage_location },
            { caption: 'publisher', v: publisher },
            { caption: 'published-date', v: published_date },
            { caption: 'ISBN_13', v: ISBN_13, useBadge: true },
            { caption: 'ISBN_10', v: ISBN_10, useBadge: true },
            { caption: 'page-count', v: page_count },
          ].map(({ caption, v, useBadge }) => (
            <Kvp
              key={caption}
              k={t(`book-detailed-page.${caption}`)}
              useBadge={useBadge}
            >
              {v ?? undefined}
            </Kvp>
          ))}
        </SimpleGrid>

        {description && (
          <Section heading={t('book-detailed-page.description')}>
            {description}
          </Section>
        )}

        {about_the_authors && (
          <Section heading={t('book-detailed-page.about-the-author')}>
            {about_the_authors}
          </Section>
        )}

        {other_photos?.length && (
          <Section heading={t('book-detailed-page.other-photos')}>
            <SimpleGrid w="full" gap={4} columns={[1, 2, 3]}>
              {other_photos.map((photo) => (
                <Box
                  key={photo}
                  position="relative"
                  h="80"
                  w="full"
                  rounded="3xl"
                  overflow="hidden"
                >
                  <Image
                    src={photo}
                    alt={`Other photos of ${title} ${subtitle || ''}`}
                    fill
                    className="image-cover"
                  />
                </Box>
              ))}
            </SimpleGrid>
          </Section>
        )}
      </Box>
    </Box>
  )
}
