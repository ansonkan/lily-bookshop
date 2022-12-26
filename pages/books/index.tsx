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

import { BookItem, BookSearchForm, Pagination } from 'components'
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
    <BaseLayout
      slotTop={
        <BookSearchForm
          position="absolute"
          bottom={0}
          left="50%"
          w="50%"
          transform="translate(-50%, 50%)"
          maxW={600}
          minW={300}
          rounded="3xl"
          boxShadow="md"
          bgColor="white"
          zIndex="dropdown"
          px={2}
          py={1}
          defaultValue={query.q}
        />
      }
    >
      <Flex
        direction="column"
        gap={4}
        /**
         * Because the first rendering doesn't have access to `BookSearchForm`'s height yet, so the gap would still stutter once
         * the part of the Chakra variables below are used inside of `BookSearchForm`
         *
         * 4: base padding
         * 10: icon's height
         * 1: `py`
         */
        pt="calc(var(--chakra-space-4) + (var(--chakra-sizes-10) / 2) + var(--chakra-sizes-1))"
      >
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
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
