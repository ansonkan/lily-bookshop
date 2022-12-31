import type { Book, DirectusBook } from 'types'
import type { GetServerSideProps, NextPage } from 'next'

import { Heading, VStack } from '@chakra-ui/react'
import { MongoClient, ObjectId } from 'mongodb'
// import { captureException } from '@sentry/nextjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb, BookItem } from 'components'
import { BaseLayout } from 'layouts'
import { formatDirectusBook } from 'utils'

interface BookPageProps {
  book: Book
  moreBooks: Book[]
}

const BookPage: NextPage<BookPageProps> = ({
  book,
  moreBooks,
}: BookPageProps) => {
  const { t } = useTranslation('common')

  return (
    <BaseLayout>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.books'), href: '/books' },
          { label: book.id },
        ]}
      />

      <BookItem variant="full" detailsLink={`/books/${book.id}`} {...book} />

      {moreBooks.length && (
        <VStack gap={[2, 4]} alignItems="stretch" mt={[8, 16]}>
          <Heading size="md">
            {t('book-detailed-page.related-books.heading')}
          </Heading>

          {moreBooks.map((book) => (
            <BookItem
              variant="detailed"
              key={book.id}
              detailsLink={`/books/${book.id}`}
              {...book}
            />
          ))}
        </VStack>
      )}
    </BaseLayout>
  )
}

export default BookPage

const LIMIT = 3

export const getServerSideProps: GetServerSideProps<
  BookPageProps,
  { id: string }
> = async ({ params, locale }) => {
  if (!params?.id) {
    return { notFound: true }
  }

  if (!process.env.MONGODB_URL_READ_WRITE) {
    throw new Error(
      'Invalid/Missing environment variable: "MONGODB_URL_READ_WRITE"'
    )
  }

  const client = await new MongoClient(
    process.env.MONGODB_URL_READ_WRITE
  ).connect()
  const books = client.db('bookshop').collection<DirectusBook>('books')

  const book = await books.findOne({ _id: new ObjectId(params.id) })

  if (!book) {
    return { notFound: true }
  }

  const [tranResult, searchResult] = await Promise.allSettled([
    serverSideTranslations(locale ?? 'en', ['common']),
    books
      .aggregate<DirectusBook>([
        {
          $search: {
            index: 'default',
            compound: {
              should: [
                {
                  text: {
                    query: [
                      ...(book.authors || []),
                      ...(book.categories || []),
                      ...book.title.split(' '),
                    ].filter((w) => !!w),
                    path: [
                      'title',
                      'subtitle',
                      'authors',
                      'categories',
                      'description',
                    ],
                    fuzzy: {},
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            _id: { $ne: new ObjectId(book._id) },
          },
        },
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
      // need to cast books from `Directus`/`MongoDB Atlas` to `DirectusBook`, then remove all of the `null` properties
      book: formatDirectusBook(book),
      moreBooks:
        searchResult.status === 'fulfilled'
          ? searchResult.value.map((v) => formatDirectusBook(v))
          : [],
    },
  }
}
