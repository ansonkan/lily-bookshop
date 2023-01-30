import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import type { BookFE } from 'types'
import type { TableContainerProps } from '@chakra-ui/react'

import { ButtonGroup, IconButton } from '@chakra-ui/react'
import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { memo, useEffect, useMemo, useState } from 'react'
import { API } from 'aws-amplify'
import useSWR from 'swr'

import { SimpleTable, V } from 'components'
import { usePrevious } from 'hooks'

export interface BooksTableProps extends TableContainerProps {
  query?: string
  onEdit?: (book: BookFE) => void
  onDelete?: (book: BookFE) => void
}

export const BooksTable = memo(
  ({
    query,
    onEdit,
    onDelete,
    ...tableContainerProps
  }: BooksTableProps): JSX.Element => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 15,
    })

    const prevQuery = usePrevious(query)

    useEffect(() => {
      if (prevQuery !== query && pageIndex !== 0) {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      }
    }, [pageIndex, query, prevQuery])

    const [sorting, setSorting] = useState<SortingState>([])

    const params = new URLSearchParams({
      limit: `${pageSize}`,
      page: `${pageIndex + 1}`,
    })
    if (query) params.append('q', query)
    if (sorting.length)
      params.append('sort', `${sorting[0].id}:${sorting[0].desc ? -1 : 1}`)

    const { data, isLoading, isValidating } = useSWR(
      ['apicore', `/books?${params.toString()}`],
      ([apiName, url]) => API.get(apiName, url, {}),
      { keepPreviousData: true }
    )

    const columns = useMemo<ColumnDef<BookFE>[]>(
      () => [
        {
          id: 'ISBN_10',
          header: 'ISBN 10',
          accessorKey: 'ISBN_10',
          cell: ({ getValue }) => (
            <V useBadge>{getValue<string | undefined>()}</V>
          ),
        },
        {
          id: 'ISBN_13',
          header: 'ISBN 13',
          accessorKey: 'ISBN_13',
          cell: ({ getValue }) => (
            <V useBadge>{getValue<string | undefined>()}</V>
          ),
        },
        {
          id: 'title',
          header: 'Title',
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
          header: 'Authors',
          accessorKey: 'authors',
          cell: (info) => (
            <V>{info.getValue<string[] | undefined>()?.join(', ')}</V>
          ),
        },
        {
          id: 'date_updated',
          header: 'Updated at',
          accessorKey: 'date_updated',
          cell: (info) => {
            const dateValue = info.getValue<number | undefined>()
            return (
              <V>
                {typeof dateValue === 'number'
                  ? new Date(dateValue).toDateString()
                  : undefined}
              </V>
            )
          },
        },
        {
          id: '_actions',
          cell: ({ row }) => (
            <ButtonGroup size="xs" variant="ghost">
              <IconButton aria-label="Edit" title="Edit" colorScheme="blue">
                <EditIcon onClick={() => onEdit?.(row.original)} />
              </IconButton>

              <IconButton aria-label="Delete" title="Delete" colorScheme="red">
                <CloseIcon onClick={() => onDelete?.(row.original)} />
              </IconButton>
            </ButtonGroup>
          ),
        },
      ],
      [onEdit, onDelete]
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

BooksTable.displayName = 'BooksTable'
