import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import type { BookFE } from 'types'
import type { TableContainerProps } from '@chakra-ui/react'

import { ButtonGroup, IconButton } from '@chakra-ui/react'
import { CloseIcon, EditIcon, Search2Icon } from '@chakra-ui/icons'
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { API } from 'aws-amplify'
import NextLink from 'next/link'
import useSWR from 'swr'
import { useTranslation } from 'next-i18next'

import { SimpleTable, V } from 'components'
import { usePrevious } from 'hooks'

export interface BooksTableProps extends TableContainerProps {
  query?: string
  onDetailsUrl: (book: BookFE) => string
  onEdit?: (book: BookFE) => void
  onDelete?: (book: BookFE) => void
}

export interface BooksTableRef {
  reload: () => void
}

export const BooksTable = memo(
  forwardRef<BooksTableRef, BooksTableProps>(
    (
      { query, onDetailsUrl, onEdit, onDelete, ...tableContainerProps },
      ref
    ): JSX.Element => {
      const { t } = useTranslation('cms')

      const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
          pageIndex: 0,
          pageSize: 15,
        })

      const prevQuery = usePrevious(query)

      useEffect(() => {
        if (prevQuery !== query && pageIndex !== 0) {
          setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        }
      }, [pageIndex, query, prevQuery])

      const [sorting, setSorting] = useState<SortingState>([
        { id: 'date_updated', desc: true },
      ])

      const params = new URLSearchParams({
        limit: `${pageSize}`,
        page: `${pageIndex + 1}`,
      })
      if (query) params.append('q', query)
      if (sorting.length)
        params.append('sort', `${sorting[0].id}:${sorting[0].desc ? -1 : 1}`)

      const { data, isLoading, isValidating, mutate } = useSWR(
        ['apicore', `/books?${params.toString()}`],
        ([apiName, url]) => API.get(apiName, url, {}),
        { keepPreviousData: true }
      )

      useImperativeHandle(
        ref,
        () => ({
          reload: () => mutate(),
        }),
        [mutate]
      )

      const columns = useMemo<ColumnDef<BookFE>[]>(
        () => [
          {
            id: 'ISBN_10',
            header: t('books.book-table.columns.isbn-10') ?? 'ISBN 10',
            accessorKey: 'ISBN_10',
            cell: ({ getValue }) => (
              <V useBadge>{getValue<string | undefined>()}</V>
            ),
          },
          {
            id: 'ISBN_13',
            header: t('books.book-table.columns.isbn-13') ?? 'ISBN 13',
            accessorKey: 'ISBN_13',
            cell: ({ getValue }) => (
              <V useBadge>{getValue<string | undefined>()}</V>
            ),
          },
          {
            id: 'title',
            header: t('books.book-table.columns.title') ?? 'Title',
            accessorKey: 'title',
            cell: (info) => (
              <V>
                {`${info.getValue()}${
                  info.row.original.subtitle
                    ? ' - ' + info.row.original.subtitle
                    : ''
                }`}
              </V>
            ),
          },
          {
            id: 'authors',
            header: t('books.book-table.columns.authors') ?? 'Authors',
            accessorKey: 'authors',
            cell: (info) => (
              <V>{info.getValue<string[] | undefined>()?.join(', ')}</V>
            ),
          },
          {
            id: 'date_updated',
            header: t('books.book-table.columns.updated-at') ?? 'Updated at',
            accessorKey: 'date_updated',
            cell: (info) => {
              const dateValue = info.getValue<number | undefined>()
              return (
                <V>
                  {typeof dateValue === 'number'
                    ? new Date(dateValue).toLocaleDateString()
                    : undefined}
                </V>
              )
            },
          },
          {
            id: '_actions',
            cell: ({ row }) => (
              <ButtonGroup variant="ghost">
                <IconButton
                  as={NextLink}
                  aria-label={
                    t('books.book-table.actions.details') ?? 'Details'
                  }
                  title={t('books.book-table.actions.details') ?? 'Details'}
                  icon={<Search2Icon />}
                  href={onDetailsUrl(row.original)}
                />

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
        [t, onDetailsUrl, onEdit, onDelete]
      )

      const pagination = useMemo(
        () => ({
          pageIndex,
          pageSize,
        }),
        [pageIndex, pageSize]
      )

      const table = useReactTable({
        data: data?.books || [],
        columns,
        pageCount: data?.total ?? -1,
        state: {
          sorting,
          pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
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

BooksTable.displayName = 'BooksTable'
