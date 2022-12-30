import type { GetServerSideProps, NextPage } from 'next'
import type { Book } from 'types'

import { Flex, VStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb, BookItem, Pagination } from 'components'
import { fakeBook, many } from 'utils'
import { BaseLayout } from 'layouts'

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
    </BaseLayout>
  )
}

export default BooksPage

const LIMIT = 20

export const getServerSideProps: GetServerSideProps<BooksPageProps> = async ({
  query,
  locale,
}) => {
  const { q = '', page = '1' } = query

  // need to investigate how `ParsedUrlQuery` works, for now just expect all parameters to be `string`
  if (typeof page !== 'string' || typeof q !== 'string')
    throw new Error('400: Bad Request')

  const pageInt = Number.parseInt(page)
  if (pageInt <= 0) throw new Error('400: Bad Request')
  // const skip = (pageInt - 1) * LIMIT

  const books = many(fakeBook, LIMIT)
  // need to cast books from `Directus`/`MongoDB Atlas` to `DirectusBook`, then remove all of the `null` properties

  const translations = await serverSideTranslations(locale ?? 'en', ['common'])

  return {
    props: {
      ...translations,
      books,
      query: {
        q,
        // 1 based
        page: pageInt,
        limit: LIMIT,
      },
      // a placeholder - https://stackoverflow.com/questions/21803290/get-a-count-of-total-documents-with-mongodb-when-using-limit
      total: 321,
    },
  }
}
