import type { GetServerSideProps, NextPage } from 'next'
import type { Book } from 'types'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  VStack,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'

import { fakeBook, many } from 'utils'
import { BaseLayout } from 'layouts'
import { BookItem } from 'components'

interface BookPageProps {
  book: Book
  moreBooks: Book[]
}

const BookPage: NextPage<BookPageProps> = ({
  book,
  moreBooks,
}: BookPageProps) => {
  return (
    <BaseLayout>
      <Breadcrumb
        separator={<ChevronRightIcon color="gray.500" />}
        fontSize="sm"
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/" as={NextLink}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href="/books" as={NextLink}>
            Books
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{book.id}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <BookItem variant="full" detailsLink={`/books/${book.id}`} {...book} />

      {moreBooks.length && (
        <VStack gap={[2, 4]} alignItems="stretch" mt={[8, 16]}>
          <Heading size="md">More books related books</Heading>

          {moreBooks.map((book) => (
            <BookItem
              variant="detailed"
              key={book.id}
              detailsLink={`/books/${book.id}`}
              noOfLines={4}
              {...book}
            />
          ))}
        </VStack>
      )}
    </BaseLayout>
  )
}

export default BookPage

export const getServerSideProps: GetServerSideProps<
  BookPageProps,
  { id: string }
> = async ({ params }) => {
  if (!params?.id)
    return {
      notFound: true,
    }

  return {
    props: {
      book: { ...fakeBook(), id: params?.id },
      moreBooks: many(fakeBook, 3),
    },
  }
}
