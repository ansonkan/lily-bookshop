import type { FormEvent } from 'react'

import type { BookFE } from 'types'

import type { BookDeleteModalRef } from './BookDeleteModal'
import type { BookEditModalRef } from './BookEditModal'
import type { BooksCreateModalRef } from './BooksCreateModal'
import type { BooksTableRef } from './BooksTable'
import type { ISBNImportModalRef } from './ISBNImportModal'

import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from '@chakra-ui/react'
import { HamburgerIcon, RepeatIcon } from '@chakra-ui/icons'
import { useCallback, useRef, useState } from 'react'
import { API } from 'aws-amplify'
import useSWR from 'swr'
import { useTranslation } from 'next-i18next'

import { Autocomplete } from 'components'
import { useDebounce } from 'hooks'

import { BookDeleteModal } from './BookDeleteModal'
import { BookEditModal } from './BookEditModal'
import { BooksCreateModal } from './BooksCreateModal'
import { BooksTable } from './BooksTable'
import { ISBNImportModal } from './ISBNImportModal'

export const BooksTabPanel = (): JSX.Element => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value)

  const tableRef = useRef<BooksTableRef>(null)

  const createModalRef = useRef<BooksCreateModalRef>(null)
  const editModalRef = useRef<BookEditModalRef>(null)
  const deleteModalRef = useRef<BookDeleteModalRef>(null)
  const isbnImportModalRef = useRef<ISBNImportModalRef>(null)

  const { data } = useSWR(
    debouncedValue
      ? ['apicore', `/books?autocomplete=${debouncedValue}`]
      : null,
    ([apiName, url]) => API.get(apiName, url, {})
  )

  const onEdit = useCallback((book: BookFE) => {
    editModalRef.current?.edit(book)
  }, [])

  const onDelete = useCallback((book: BookFE) => {
    deleteModalRef.current?.askToDelete(book)
  }, [])

  return (
    <VStack gap={[2, 4]}>
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
            onChange={(value) => setValue(value)}
          />
        </Box>

        <ButtonGroup isAttached>
          <Button
            leftIcon={<RepeatIcon />}
            onClick={() => tableRef.current?.reload()}
          >
            Reload
          </Button>

          <Menu>
            <MenuButton as={IconButton} icon={<HamburgerIcon />} />
            <MenuList>
              <MenuItem onClick={() => createModalRef.current?.create()}>
                Create
              </MenuItem>

              <MenuItem onClick={() => isbnImportModalRef.current?.open()}>
                Import by ISBN
              </MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </HStack>

      <BooksTable
        w="full"
        query={debouncedValue}
        onEdit={onEdit}
        onDelete={onDelete}
        ref={tableRef}
      />

      <BooksCreateModal ref={createModalRef} />

      <BookEditModal ref={editModalRef} />

      <BookDeleteModal ref={deleteModalRef} />

      <ISBNImportModal
        ref={isbnImportModalRef}
        create={(books) => createModalRef.current?.create(books)}
      />
    </VStack>
  )
}
