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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

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
  const { t } = useTranslation('common')

  return (
    <BaseLayout>
      <Breadcrumb
        separator={<ChevronRightIcon color="gray.500" />}
        fontSize="sm"
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/" as={NextLink}>
            {t('breadcrumb.home')}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href="/books" as={NextLink}>
            {t('breadcrumb.books')}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{book.id}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

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
> = async ({ params, locale }) => {
  if (!params?.id) {
    return {
      notFound: true,
    }
  }

  const translations = await serverSideTranslations(locale ?? 'en', ['common'])

  return {
    props: {
      ...translations,
      book: { ...fakeBook(), id: params?.id },
      moreBooks: many(fakeBook, 3),
    },
  }
}
