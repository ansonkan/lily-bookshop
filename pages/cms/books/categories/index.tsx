import type { GetStaticProps, NextPage } from 'next'

import type {
  BookCategoryDeleteModalRef,
  BookCategoryModalRef,
  BookCategoryTableRef,
} from 'features'
import type { BookCategoryFE } from 'types'

import { AddIcon, RepeatIcon } from '@chakra-ui/icons'
import { Button, Heading, VStack } from '@chakra-ui/react'
import { useCallback, useRef } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import {
  BookCategoryDeleteModal,
  BookCategoryModal,
  BookCategoryTable,
} from 'features'
import { ArrowBreadcrumb } from 'components'
import { ProtectedLayout } from 'layouts'

const BookCategoriesPage: NextPage = () => {
  const { t } = useTranslation('cms')

  const tableRef = useRef<BookCategoryTableRef>(null)
  const modalRef = useRef<BookCategoryModalRef>(null)
  const deleteModalRef = useRef<BookCategoryDeleteModalRef>(null)

  const onEdit = useCallback((cat: BookCategoryFE) => {
    modalRef.current?.edit(cat)
  }, [])

  const onDelete = useCallback((cat: BookCategoryFE) => {
    deleteModalRef.current?.askToDelete(cat)
  }, [])

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

      <Button
        alignSelf="center"
        leftIcon={<AddIcon />}
        onClick={() => modalRef.current?.create()}
      >
        {t('book-categories.add.heading')}
      </Button>

      <VStack gap={4}>
        <Button
          alignSelf="self-end"
          leftIcon={<RepeatIcon />}
          onClick={() => tableRef.current?.reload()}
        >
          {t('books.book-table.reload')}
        </Button>

        <BookCategoryTable
          ref={tableRef}
          onEdit={onEdit}
          onDelete={onDelete}
          w="full"
        />

        <BookCategoryModal ref={modalRef} />

        <BookCategoryDeleteModal ref={deleteModalRef} />
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
