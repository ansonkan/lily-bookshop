import type { GetServerSideProps, NextPage } from 'next'
import type { Book } from 'types'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  VStack,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'

import { BookItem, Pagination } from 'components'
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
  return (
    <BaseLayout defaultValue={query.q}>
      <Breadcrumb
        separator={<ChevronRightIcon color="gray.500" />}
        fontSize="sm"
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/" as={NextLink}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Books</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <VStack gap={[2, 4]} alignItems="stretch">
        {books.map((book) => (
          <BookItem
            variant="detailed"
            key={book.id}
            detailsLink={`/books/${book.id}`}
            noOfLines={4}
            {...book}
          />
        ))}
      </VStack>

      <Flex justifyContent="center">
        <Pagination
          page={query.page}
          limit={query.limit}
          total={total}
          getLink={(page) => {
            const { q, limit } = query
            const searchParams = new URLSearchParams({
              page: page + '',
              limit: limit + '',
            })
            if (q) searchParams.append('q', q)

            searchParams.sort()

            return `/books?${searchParams.toString()}`
          }}
        />
      </Flex>
    </BaseLayout>
  )
}

export default BooksPage

const LIMIT = 20

export const getServerSideProps: GetServerSideProps<BooksPageProps> = async ({
  query,
}) => {
  const { q = '', page = '1' } = query

  // need to investigate how `ParsedUrlQuery` works, for now just expect all parameters to be `string`
  if (typeof page !== 'string' || typeof q !== 'string')
    throw new Error('400 Bad Request')

  const pageInt = Number.parseInt(page)
  if (pageInt <= 0) throw new Error('400 Bad Request')
  // const skip = (pageInt - 1) * LIMIT

  const books = many(fakeBook, LIMIT)

  return {
    props: {
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
