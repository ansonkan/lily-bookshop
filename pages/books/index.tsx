import type { Book, DirectusBook } from 'types'
import type { GetServerSideProps, NextPage } from 'next'

import { Center, Flex, Text, VStack } from '@chakra-ui/react'
import { WarningTwoIcon } from '@chakra-ui/icons'
// import { captureException } from '@sentry/nextjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb, BookItem, Pagination } from 'components'
import { BaseLayout } from 'layouts'
import clientPromise from 'utils/mongodb'
import { formatDirectusBook } from 'utils'

interface BooksPageQuery {
  q?: string
  // 1 based
  page: number
  limit: number
}

interface BooksPageProps {
  query: BooksPageQuery
  books: Book[]
  total: number
}

const BooksPage: NextPage<BooksPageProps> = ({
  query,
  books,
  total,
}: BooksPageProps) => {
  const { t } = useTranslation('common')

  return (
    <BaseLayout defaultValue={query.q}>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.books') },
        ]}
      />

      {books.length ? (
        <>
          <VStack gap={[2, 4]} alignItems="stretch">
            {books.map((book) => (
              <BookItem
                variant="detailed"
                key={book.id}
                detailsLink={`/books/${book.id}`}
                {...book}
              />
            ))}
          </VStack>

          <Flex justifyContent="center">
            <Pagination page={query.page} limit={query.limit} total={total} />
          </Flex>
        </>
      ) : (
        <Center flexDirection="column" minH="30vh">
          <WarningTwoIcon boxSize={['20']} color="orange" />
          <Text as="b">{t('book-search-page.zero-result')}</Text>
        </Center>
      )}
    </BaseLayout>
  )
}

export default BooksPage

interface SearchMeta {
  meta: {
    count: { lowerBound: number }
  }
}

const LIMIT = 20

export const getServerSideProps: GetServerSideProps<BooksPageProps> = async ({
  query,
  locale,
}) => {
  const { q = '', page = '1' } = query

  // need to investigate how `ParsedUrlQuery` works, for now just expect all parameters to be `string`
  if (typeof page !== 'string' || typeof q !== 'string') {
    throw new Error('400: Bad Request')
  }

  const pageInt = Number.parseInt(page)
  if (pageInt <= 0) {
    throw new Error('400: Bad Request')
  }

  const skip = (pageInt - 1) * LIMIT

  const client = await clientPromise
  const books = client.db('bookshop').collection<DirectusBook>('books')
  // need to cast books from `Directus`/`MongoDB Atlas` to `DirectusBook`, then remove all of the `null` properties

  // const books = many(fakeBook, LIMIT)

  const [tranResult, searchResult] = await Promise.allSettled([
    serverSideTranslations(locale ?? 'en', ['common']),
    books
      .aggregate<DirectusBook & SearchMeta>([
        {
          $search: {
            index: 'default',
            count: {
              type: 'lowerBound',
            },
            compound: {
              should: [
                {
                  text: {
                    query: q,
                    path: [
                      'title',
                      'subtitle',
                      'authors',
                      'ISBN_13',
                      'ISBN_10',
                      'categories',
                    ],
                    fuzzy: {},
                  },
                },
              ],
            },
          },
        },
        {
          $project: {
            meta: '$$SEARCH_META',
          },
        },
        { $skip: skip },
        {
          $limit: LIMIT,
        },
      ])
      .toArray(),
  ])

  // if (tranResult.status === 'rejected') {
  //   captureException(tranResult.reason)
  // }

  // if (searchResult.status === 'rejected') {
  //   captureException(searchResult.reason)
  // }

  return {
    props: {
      ...(tranResult.status === 'fulfilled' ? tranResult.value : {}),
      books:
        searchResult.status === 'fulfilled'
          ? searchResult.value.map((v) => formatDirectusBook(v))
          : [],
      query: {
        q,
        // 1 based
        page: pageInt,
        limit: LIMIT,
      },
      // a placeholder - https://stackoverflow.com/questions/21803290/get-a-count-of-total-documents-with-mongodb-when-using-limit
      total:
        searchResult.status === 'fulfilled' && searchResult.value.length
          ? searchResult.value[0].meta.count.lowerBound
          : 0,
    },
  }
}
