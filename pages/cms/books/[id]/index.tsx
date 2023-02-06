import type { GetServerSideProps, NextPage } from 'next'

import type { BookDeleteModalRef } from 'features/cms/books/BookDeleteModal'
import type { BookFE } from 'types'

import '@aws-amplify/ui-react/styles.css'
import { Button, Flex, SimpleGrid, VStack } from '@chakra-ui/react'
import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { useCallback, useRef } from 'react'
import NextLink from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { withSSRContext } from 'aws-amplify'

import { ArrowBreadcrumb, BookItem } from 'components'
import { BaseLayout } from 'layouts'
import { BookDeleteModal } from 'features/cms/books/BookDeleteModal'

interface CMSBookDetailsPageProps {
  book: BookFE
}

const CMSBookDetailsPage: NextPage<CMSBookDetailsPageProps> = ({
  book,
}: CMSBookDetailsPageProps) => {
  const { push, query, asPath } = useRouter()
  const { t } = useTranslation('cms')

  const deleteModalRef = useRef<BookDeleteModalRef>(null)

  const onDelete = useCallback((book: BookFE) => {
    deleteModalRef.current?.askToDelete(book)
  }, [])

  const onDeleteComplete = useCallback(() => {
    push({ pathname: '/cms/books' })
  }, [push])

  return (
    <BaseLayout hideTopSlot>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
          { label: t('breadcrumb.manage-books'), href: '/cms/books' },
          { label: query.id + '', href: asPath },
        ]}
      />

      <Flex gap={4} wrap="wrap" justifyContent="end">
        <SimpleGrid gap={4} columns={2}>
          <Button
            as={NextLink}
            href={`/cms/books/${book.id}/edit`}
            colorScheme="blue"
            leftIcon={<EditIcon />}
          >
            {t('books.book-table.actions.edit')}
          </Button>

          <Button
            onClick={() => onDelete(book)}
            colorScheme="red"
            leftIcon={<CloseIcon />}
          >
            {t('books.book-table.actions.delete')}
          </Button>
        </SimpleGrid>
      </Flex>

      <VStack gap={4}>
        {/* Books actions */}
        <BookItem
          variant="full"
          detailsLink={`/books/${book.id}`}
          book={book}
        />

        <BookDeleteModal
          ref={deleteModalRef}
          onDeleteComplete={onDeleteComplete}
        />
      </VStack>
    </BaseLayout>
  )
}

export default withAuthenticator(CMSBookDetailsPage, { hideSignUp: true })

export const getServerSideProps: GetServerSideProps<
  CMSBookDetailsPageProps,
  { id: string }
> = async ({ params, locale, req }) => {
  if (!params?.id) {
    return { notFound: true }
  }

  const SSR = withSSRContext({ req })

  const { book } = await SSR.API.get(
    'apicore',
    `/books/${params.id}?useThumbnailLink=1`
  )

  if (!book) {
    return { notFound: true }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
      book,
    },
  }
}
