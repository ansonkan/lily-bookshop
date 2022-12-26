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
import { useRef } from 'react'

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
  const formRef = useRef<HTMLDivElement>(null)

  const pt = formRef.current?.clientHeight
    ? formRef.current?.clientHeight / 2
    : 0

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
          ref={formRef}
        />
      }
    >
      <Flex
        direction="column"
        gap={4}
        pt={`calc(var(--chakra-space-4) + ${pt}px)`}
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
              flexShrink={0}
              flexGrow={0}
              detailsLink={`/books/${book.id}`}
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
  const { q, page = '1' } = query

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
