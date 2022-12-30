import type { GetServerSideProps, NextPage } from 'next'
import type { Book } from 'types'

import { Heading, VStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb, BookItem } from 'components'
import { fakeBook, many } from 'utils'
import { BaseLayout } from 'layouts'

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
      // need to cast books from `Directus`/`MongoDB Atlas` to `DirectusBook`, then remove all of the `null` properties
      book: { ...fakeBook(), id: params?.id },
      moreBooks: many(fakeBook, 3),
    },
  }
}
