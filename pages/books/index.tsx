import type { GetServerSideProps, NextPage } from 'next'
import type { BookFE } from 'types'

import { Center, Flex, VStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { withSSRContext } from 'aws-amplify'

import { ArrowBreadcrumb, BookItem, NoData, Pagination } from 'components'
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
  books: BookFE[]
  total: number
}

const LIMIT = 10

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
          { label: t('breadcrumb.books'), href: '/books' },
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
          <NoData />
        </Center>
      )}
    </BaseLayout>
  )
}

export default BooksPage

export const getServerSideProps: GetServerSideProps<BooksPageProps> = async ({
  query,
  locale,
  req,
}) => {
  const SSR = withSSRContext({ req })

  const { q = '', page = '1' } = query

  // need to investigate how `ParsedUrlQuery` works, for now just expect all parameters to be `string`
  if (typeof page !== 'string' || typeof q !== 'string') {
    return {
      statusCode: 400,
      props: {
        books: [],
        total: 0,
        query: {
          q: '',
          page: 1,
          limit: LIMIT,
        },
      },
    }
  }

  const [translations, searchResult] = await Promise.all([
    serverSideTranslations(locale ?? 'en', ['common']),
    SSR.API.get('apicore', `/books?q=${q}&limit=${LIMIT}&page=${page}`),
  ])

  return {
    props: {
      ...translations,
      ...searchResult,
      books: searchResult.books.map((v: BookFE) => formatDirectusBook(v)),
    },
    revalidate: 3600, // 1 hour
  }
}
