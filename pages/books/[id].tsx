import type { Book, MongoDbBook } from 'types'
import type { GetServerSideProps, NextPage } from 'next'

import { Heading, VStack } from '@chakra-ui/react'
import { MongoClient } from 'mongodb'
import { captureException } from '@sentry/nextjs'
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
          { label: book.directusId },
        ]}
      />

      <BookItem
        variant="full"
        detailsLink={`/books/${book.directusId}`}
        book={book}
      />

      {moreBooks.length && (
        <VStack gap={[2, 4]} alignItems="stretch" mt={[8, 16]}>
          <Heading size="md">
            {t('book-detailed-page.related-books.heading')}
          </Heading>

          {moreBooks.map((book) => (
            <BookItem
              variant="detailed"
              key={book.directusId}
              detailsLink={`/books/${book.directusId}`}
              book={book}
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

  if (!process.env.MONGODB_URL_READ_ONLY) {
    throw new Error('Invalid/Missing environment variable')
  }

  const client = new MongoClient(process.env.MONGODB_URL_READ_ONLY)

  try {
    await client.connect()
    const books = client.db('bookshop').collection<MongoDbBook>('books')

    const book = await books.findOne(
      { directusId: params.id },
      { projection: { _id: 0 } }
    )

    if (!book) {
      return { notFound: true }
    }

    const [tranResult, searchResult] = await Promise.allSettled([
      serverSideTranslations(locale ?? 'en', ['common']),
      books
        .aggregate<MongoDbBook>([
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
              directusId: { $ne: book.directusId },
            },
          },
          { $project: { _id: 0 } },
          {
            $limit: LIMIT,
          },
        ])
        .toArray(),
    ])

    return {
      props: {
        ...(tranResult.status === 'fulfilled' ? tranResult.value : {}),
        book: formatDirectusBook(book),
        moreBooks:
          searchResult.status === 'fulfilled'
            ? searchResult.value.map((v) => formatDirectusBook(v))
            : [],
      },
    }
  } catch (err) {
    captureException(err)
    throw err
  } finally {
    await client.close()
  }
}
