import type { Book, MongoDbBook } from 'types'
import type { GetServerSideProps, NextPage } from 'next'

import { Center, Flex, Text, VStack } from '@chakra-ui/react'
import { MongoClient } from 'mongodb'
import { WarningTwoIcon } from '@chakra-ui/icons'
import { captureException } from '@sentry/nextjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb, BookItem, Pagination } from 'components'
import { BaseLayout } from 'layouts'
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

const LIMIT = 20

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
                key={book.directusId}
                detailsLink={`/books/${book.directusId}`}
                book={book}
              />
            ))}
          </VStack>

          {!(query.page === 1 && books.length < LIMIT) && (
            <Flex justifyContent="center">
              <Pagination page={query.page} limit={query.limit} total={total} />
            </Flex>
          )}
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

export const getServerSideProps: GetServerSideProps<BooksPageProps> = async ({
  query,
  locale,
}) => {
  if (!process.env.MONGODB_URL_READ_ONLY) {
    throw new Error('Invalid/Missing environment variable')
  }

  const client = new MongoClient(process.env.MONGODB_URL_READ_ONLY)

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

  try {
    await client.connect()
    const books = client.db('bookshop').collection<MongoDbBook>('books')
    // need to cast books from `Directus`/`MongoDB Atlas` to `DirectusBook`, then remove all of the `null` properties

    // const books = many(fakeBook, LIMIT)

    const [tranResult, searchResult] = await Promise.allSettled([
      serverSideTranslations(locale ?? 'en', ['common']),
      books
        .aggregate([
          {
            $search: {
              index: 'default',
              count: {
                type: 'total',
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
          { $project: { _id: 0 } },
          {
            $facet: {
              books: [{ $skip: skip }, { $limit: LIMIT }],
              meta: [{ $replaceWith: '$$SEARCH_META' }, { $limit: 1 }],
            },
          },
        ])
        .toArray(),
    ])

    let total = 0
    let searchedBooks: Book[] = []

    if (searchResult.status === 'fulfilled' && searchResult.value.length) {
      const value = searchResult.value[0] as unknown as {
        books: MongoDbBook[]
        meta: { count: { total: number } }[]
      }

      total = value.meta[0] ? value.meta[0].count.total : 0
      searchedBooks = value.books.map((v) => formatDirectusBook(v))
    }

    return {
      props: {
        ...(tranResult.status === 'fulfilled' ? tranResult.value : {}),
        books: searchedBooks,
        total,
        query: {
          q,
          // 1 based
          page: pageInt,
          limit: LIMIT,
        },
      },
    }
  } catch (err) {
    captureException(err)
    throw err
  } finally {
    await client.close()
  }
}
