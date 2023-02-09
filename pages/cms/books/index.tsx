import type { GetStaticProps, NextPage } from 'next'
import type { FormEvent } from 'react'

import type { BookDeleteModalRef } from 'features/cms/books/BookDeleteModal'
import type { BookFE } from 'types'
import type { BooksTableRef } from 'features/cms/books/BooksTable'

import { AddIcon, RepeatIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  HStack,
  Heading,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react'
import { useCallback, useRef, useState } from 'react'
import { API } from 'aws-amplify'
import NextLink from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb, Autocomplete } from 'components'
import { BookDeleteModal } from 'features/cms/books/BookDeleteModal'
import { BooksTable } from 'features/cms/books/BooksTable'
import { ProtectedLayout } from 'layouts'
import { useDebounce } from 'hooks'

const CMSBooksPage: NextPage = () => {
  const { t } = useTranslation('cms')
  const { push } = useRouter()

  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value)

  const [bookTableQuery, setBookTableQuery] = useState('')

  const tableRef = useRef<BooksTableRef>(null)
  const deleteModalRef = useRef<BookDeleteModalRef>(null)

  const { data } = useSWR(
    debouncedValue
      ? ['apicore', `/books?autocomplete=${debouncedValue}`]
      : null,
    ([apiName, url]) => API.get(apiName, url, {})
  )

  const onDetailsUrl = useCallback(
    (book: BookFE) => `/cms/books/${book.id}`,
    []
  )

  const onEdit = useCallback(
    (book: BookFE) => {
      push({ pathname: `/cms/books/${book.id}/edit` })
    },
    [push]
  )

  const onDelete = useCallback((book: BookFE) => {
    deleteModalRef.current?.askToDelete(book)
  }, [])

  return (
    <ProtectedLayout>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
          { label: t('breadcrumb.manage-books'), href: '/cms/books' },
        ]}
      />

      <Heading>{t('breadcrumb.manage-books')}</Heading>

      <VStack gap={4}>
        {/* Other actions */}
        <SimpleGrid gap={4} columns={[1, 2, 3]}>
          <Button as={NextLink} href="/cms/books/add" leftIcon={<AddIcon />}>
            {t('books.other-actions.add')}
          </Button>

          <Button as={NextLink} href="/cms/books/search-from-google-book">
            {t('books.other-actions.search-from-google-book')}
          </Button>

          <Button as={NextLink} href="/cms/books/categories">
            {t('books.other-actions.manage-categories')}
          </Button>

          {/* <Button as={NextLink} href="/cms/books/featured-section">
            {t('books.other-actions.manage-featured')}
          </Button> */}

          {/* Note: just use `date_created` to sort out this section for now */}
          {/* <Button as={NextLink} href="/cms/books/latest-additions-section">
            {t('books.other-actions.manage-latest-additions')}
          </Button> */}
        </SimpleGrid>

        {/* Books actions */}
        <HStack w="full">
          <Box
            as="form"
            flexGrow={1}
            onSubmit={(event: FormEvent<HTMLFormElement | HTMLDivElement>) => {
              event.preventDefault()
            }}
          >
            <Autocomplete
              options={data?.options || []}
              value={value}
              placeholder={t('book-search-form.placeholder') ?? ''}
              searchButtonLabel={t('book-search-form.search-button') ?? ''}
              onChange={(value) => setValue(value)}
              onSearch={() => setBookTableQuery(value)}
            />
          </Box>

          <Button
            leftIcon={<RepeatIcon />}
            onClick={() => tableRef.current?.reload()}
          >
            {t('books.book-table.reload')}
          </Button>
        </HStack>

        <BooksTable
          w="full"
          query={bookTableQuery}
          onDetailsUrl={onDetailsUrl}
          onEdit={onEdit}
          onDelete={onDelete}
          ref={tableRef}
        />

        <BookDeleteModal ref={deleteModalRef} />
      </VStack>
    </ProtectedLayout>
  )
}

export default CMSBooksPage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
    },
  }
}
