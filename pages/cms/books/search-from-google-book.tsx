import type { GetStaticProps, NextPage } from 'next'

import type { BookCreateModalRef, GoogleBookSearchResult } from 'features'
import type { NewGoogleBook } from 'types'

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  Heading,
  VStack,
} from '@chakra-ui/react'
import { FormEvent, useMemo, useRef, useState } from 'react'
import { LANG_CODES } from '@lily-bookshop/schemas'
import { RepeatIcon } from '@chakra-ui/icons'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import useSWR from 'swr'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb, Autocomplete, BookItem } from 'components'
import {
  BookCreateModal,
  getISBN,
  googleBookToNewBook,
} from 'features/cms/books'
import { ProtectedLayout } from 'layouts'

const SearchFromGoogleBookPage: NextPage = () => {
  const { t } = useTranslation('cms')

  const createModal = useRef<BookCreateModalRef>(null)

  const [value, setValue] = useState('')
  const [preparingIndex, setPreparingIndex] = useState<number | undefined>()

  const { data, mutate, isLoading, isValidating } =
    useSWR<GoogleBookSearchResult>(
      value && preparingIndex === undefined
        ? `https://www.googleapis.com/books/v1/volumes?q=${value}`
        : null,
      (url) => fetch(url).then((r) => r.json()),
      { keepPreviousData: true }
    )

  const matches = useMemo<NewGoogleBook[]>(() => {
    if (!data?.items) return []

    return data.items.map((item) => {
      const { ISBN_10, ISBN_13 } = getISBN(item)

      return {
        ...(item.volumeInfo || {}),
        title: item.volumeInfo?.title || '',
        status: 'draft',
        quantity: 1,
        ISBN_10,
        ISBN_13,
        language: LANG_CODES.find((c) => c === item.volumeInfo?.language),
        thumbnail:
          item.volumeInfo?.imageLinks?.thumbnail ||
          item.volumeInfo?.imageLinks?.smallThumbnail,
        original: item,
      }
    })
  }, [data])

  return (
    <ProtectedLayout>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
          { label: t('breadcrumb.manage-books'), href: '/cms/books' },
          {
            label: t('breadcrumb.search-from-google-book'),
            href: '/cms/books/search-from-google-book',
          },
        ]}
      />

      <Heading>{t('breadcrumb.search-from-google-book')}</Heading>

      <VStack gap={4}>
        <HStack w="full">
          <Box
            as="form"
            flexGrow={1}
            onSubmit={(event: FormEvent<HTMLFormElement | HTMLDivElement>) => {
              event.preventDefault()
            }}
          >
            <Autocomplete
              options={[]}
              placeholder={t('book-search-form.placeholder') ?? ''}
              searchButtonLabel={t('book-search-form.search-button') ?? ''}
              onSearch={(v) => setValue(v)}
              isLoading={isLoading}
            />
          </Box>

          <Button
            leftIcon={<RepeatIcon />}
            onClick={() => mutate()}
            isLoading={isValidating}
          >
            {t('books.book-table.reload')}
          </Button>
        </HStack>

        {matches.map((book, index) => {
          const _V = (value || '').trim().toLowerCase()

          const isExactMatch =
            book.ISBN_10?.toLowerCase() === _V ||
            book.ISBN_13?.toLowerCase() === _V ||
            book.title?.toLowerCase() === _V

          return (
            <VStack key={book.title + index} w="full">
              {isExactMatch && (
                <Alert status="info">
                  <AlertIcon />
                  This is an exact match!
                </Alert>
              )}

              <BookItem book={book} variant="detailed" />

              <Button
                onClick={async () => {
                  try {
                    setPreparingIndex(index)

                    const cleanedGoogleBook = (
                      await googleBookToNewBook([book.original])
                    )[0]

                    createModal.current?.create({
                      ...cleanedGoogleBook,
                      // Note: overwrite `categories` from Google Book because I think better leave this after Lily defines her own category list
                      categories: undefined,
                    })
                  } finally {
                    setPreparingIndex(undefined)
                  }
                }}
                isLoading={index === preparingIndex}
              >
                Add this book
              </Button>
            </VStack>
          )
        })}
      </VStack>

      <BookCreateModal ref={createModal} />
    </ProtectedLayout>
  )
}

export default SearchFromGoogleBookPage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
    },
  }
}
