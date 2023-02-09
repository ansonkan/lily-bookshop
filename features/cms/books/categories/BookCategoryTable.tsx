import type { BookCategoryFE } from 'types'
import type { ColumnDef } from '@tanstack/react-table'
import type { TableContainerProps } from '@chakra-ui/react'

import { ButtonGroup, IconButton } from '@chakra-ui/react'
import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { forwardRef, memo, useImperativeHandle, useMemo } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { API } from 'aws-amplify'
import useSWR from 'swr'
import { useTranslation } from 'next-i18next'

import { SimpleTable, V } from 'components'

export interface BookCategoryTableProps extends TableContainerProps {
  onEdit?: (cat: BookCategoryFE) => void
  onDelete?: (cat: BookCategoryFE) => void
}

export interface BookCategoryTableRef {
  reload: () => void
}

export const BookCategoryTable = memo(
  forwardRef<BookCategoryTableRef, BookCategoryTableProps>(
    ({ onEdit, onDelete, ...tableContainerProps }, ref): JSX.Element => {
      const { t } = useTranslation('cms')

      const { data, isLoading, isValidating, mutate } = useSWR(
        ['apicore', '/book-categories'],
        ([apiName, url]) => API.get(apiName, url, {})
      )

      useImperativeHandle(
        ref,
        () => ({
          reload: () => mutate(),
        }),
        [mutate]
      )

      const columns = useMemo<ColumnDef<BookCategoryFE>[]>(
        () => [
          {
            id: 'en',
            header:
              t('book-categories.book-category-table.columns.en') ?? 'English',
            accessorKey: 'en',
            cell: ({ getValue }) => <V>{getValue<string | undefined>()}</V>,
          },
          {
            id: 'zh_HK',
            header:
              t('book-categories.book-category-table.columns.zh_HK') ??
              'Chinese',
            accessorKey: 'zh_HK',
            cell: ({ getValue }) => <V>{getValue<string | undefined>()}</V>,
          },
          {
            id: '_actions',
            cell: ({ row }) => (
              <ButtonGroup variant="ghost">
                <IconButton
                  aria-label={t('books.book-table.actions.edit') ?? 'Edit'}
                  title={t('books.book-table.actions.edit') ?? 'Edit'}
                  colorScheme="blue"
                  icon={<EditIcon />}
                  onClick={() => onEdit?.(row.original)}
                />

                <IconButton
                  aria-label={t('books.book-table.actions.delete') ?? 'Delete'}
                  title={t('books.book-table.actions.delete') ?? 'Delete'}
                  colorScheme="red"
                  icon={<CloseIcon />}
                  onClick={() => onDelete?.(row.original)}
                />
              </ButtonGroup>
            ),
          },
        ],
        [t, onEdit, onDelete]
      )

      const table = useReactTable({
        data: data?.book_categories || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      return (
        <SimpleTable
          table={table}
          isLoading={isLoading}
          isValidating={isValidating}
          {...tableContainerProps}
        />
      )
    }
  )
)

BookCategoryTable.displayName = 'BookCategoryTable'
