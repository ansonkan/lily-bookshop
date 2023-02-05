import type { GetServerSideProps, NextPage } from 'next'
import type { BookFE } from 'types'

import { Heading, VStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { withSSRContext } from 'aws-amplify'

import { ArrowBreadcrumb, BookItem } from 'components'
import { BaseLayout } from 'layouts'

interface BookPageProps {
  book: BookFE
  moreBooks: BookFE[]
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

      <BookItem variant="full" detailsLink={`/books/${book.id}`} book={book} />

      {moreBooks.length > 0 && (
        <VStack gap={[2, 4]} alignItems="stretch" mt={[8, 16]}>
          <Heading size="md">
            {t('book-detailed-page.related-books.heading')}
          </Heading>

          {moreBooks.map((book) => (
            <BookItem
              variant="detailed"
              key={book.id}
              detailsLink={`/books/${book.id}`}
              book={book}
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
> = async ({ params, locale, req, res }) => {
  if (!params?.id) {
    return { notFound: true }
  }

  const SSR = withSSRContext({ req })

  const { book } = await SSR.API.get('apicore', `/books/${params.id}`)

  if (!book) {
    return { notFound: true }
  }

  const [translations, searchRes] = await Promise.all([
    serverSideTranslations(locale ?? 'en', ['common']),
    SSR.API.get(
      'apicore',
      `/books?relatedTo=${params.id}&sortOnlyExist=1&limit=5`
    ),
  ])

  // res.setHeader('Cache-Control', 's-maxage=3600')
  res.setHeader('Cache-Control', 's-maxage=60')

  return {
    props: {
      ...translations,
      book: book,
      moreBooks: searchRes.books,
    },
  }
}
