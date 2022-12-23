import type { GetServerSideProps, NextPage } from 'next'
import type { Book } from 'types'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'

import { fakeBook, many } from 'utils'
import { BookItem } from 'components'

interface BooksPageProps {
  books: Book[]
  query?: unknown
}

const BooksPage: NextPage<BooksPageProps> = ({
  books,
  query,
}: BooksPageProps) => {
  return (
    <Container>
      <Flex direction="column" gap={4}>
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

        <Text>{JSON.stringify(query)}</Text>

        <VStack gap={[2, 4]}>
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
      </Flex>
    </Container>
  )
}

export default BooksPage

export const getServerSideProps: GetServerSideProps<BooksPageProps> = async ({
  query,
}) => {
  return {
    props: {
      books: many(fakeBook, 20),
      query,
    },
  }
}
