import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import type { BookFE } from 'types'
import type { TableContainerProps } from '@chakra-ui/react'

import {
  Box,
  Fade,
  Progress,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { API } from 'aws-amplify'
import useSWR from 'swr'

import { Pagination } from '../../Pagination'
import { TableSkeleton } from './TableSkeleton'
import { V } from '../../Kvp'

export interface BookTableProps extends TableContainerProps {
  query?: string
}

export const BookTable = ({
  query,
  ...tableContainerProps
}: BookTableProps): JSX.Element => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [query])

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
            }
            `}
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
        cell: (info) => <V>{info.getValue<string | undefined>()}</V>,
      },
    ],
    []
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
    <>
      <TableContainer {...tableContainerProps}>
        <Table variant="simple" size="sm" position="relative">
          <Thead position="relative">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <Box
                        cursor={header.column.getCanSort() ? 'pointer' : ''}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </Box>
                    )}
                  </Th>
                ))}
              </Tr>
            ))}

            <Fade in={isValidating} unmountOnExit>
              <Progress
                size="xs"
                isIndeterminate
                position="absolute"
                w="full"
              />
            </Fade>
          </Thead>

          <Tbody>
            {isLoading ? (
              <TableSkeleton
                col={table.getAllColumns().length}
                row={pageSize}
              />
            ) : (
              table.getRowModel().rows.map((row) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      )
                    })}
                  </Tr>
                )
              })
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Pagination
        w="full"
        mt={[2, 4]}
        justifyContent="center"
        page={pageIndex + 1}
        limit={pageSize}
        total={table.getPageCount()}
        onPageChange={(page) => table.setPageIndex(page - 1)}
      />
    </>
  )
}
