import type { GetStaticProps, NextPage } from 'next'

// import type { BookCategoryDocumentFE } from 'types'
import type { BookCategoryTableRef } from 'features'

import { Button, Heading, VStack } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRef } from 'react'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb } from 'components'
import { BookCategoryTable } from 'features'
import { ProtectedLayout } from 'layouts'

const BookCategoriesPage: NextPage = () => {
  const { t } = useTranslation('cms')

  const tableRef = useRef<BookCategoryTableRef>(null)
  // const deleteModalRef = useRef<BookDeleteModalRef>(null)

  // const onEdit = useCallback((cat: BookCategoryDocumentFE) => {
  //   // push({ pathname: `/cms/books/${book.id}/edit` })
  //   console.log(cat)
  // }, [])

  // const onDelete = useCallback((cat: BookCategoryDocumentFE) => {
  //   // deleteModalRef.current?.askToDelete(book)
  //   console.log(cat)
  // }, [])

  return (
    <ProtectedLayout>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
          { label: t('breadcrumb.manage-books'), href: '/cms/books' },
          {
            label: t('breadcrumb.manage-book-categories'),
            href: '/cms/books/categories',
          },
        ]}
      />

      <Heading>{t('breadcrumb.manage-book-categories')}</Heading>

      <VStack gap={4}>
        <Button
          alignSelf="self-end"
          leftIcon={<RepeatIcon />}
          onClick={() => tableRef.current?.reload()}
        >
          Reload
        </Button>

        {/* <BookCategoryTable ref={tableRef} onEdit={onEdit} onDelete={onDelete} /> */}
        <BookCategoryTable ref={tableRef} />
      </VStack>
    </ProtectedLayout>
  )
}

export default BookCategoriesPage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
    },
  }
}
