import type { Table as TTable } from '@tanstack/react-table'
import type { TableContainerProps } from '@chakra-ui/react'

import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import {
  Box,
  Fade,
  Progress,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { flexRender } from '@tanstack/react-table'

import { Pagination } from '../Pagination'
import { TableSkeleton } from '../TableSkeleton'

export interface SimpleTableProps<T> extends TableContainerProps {
  table: TTable<T>
  isValidating?: boolean
  isLoading?: boolean
}

export const SimpleTable = <T,>({
  table,
  isValidating,
  isLoading,
  ...others
}: SimpleTableProps<T>): JSX.Element => (
  <>
    <TableContainer {...others}>
      <Table variant="simple" size="sm" position="relative">
        <Thead>
          <Headers table={table} />

          <Fade in={isValidating} unmountOnExit>
            <Progress size="xs" isIndeterminate position="absolute" w="full" />
          </Fade>
        </Thead>

        <Tbody>
          {isLoading ? (
            <TableSkeleton
              col={table.getAllColumns().length}
              row={table.getState().pagination?.pageSize ?? 25}
            />
          ) : table.getRowModel().rows.length ? (
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
          ) : (
            <div>nothing found</div>
          )}
        </Tbody>

        <Tfoot position="relative">
          <Fade in={isValidating} unmountOnExit>
            <Progress
              size="xs"
              isIndeterminate
              position="absolute"
              w="full"
              top={0}
              transform="translateY(-100%)"
            />
          </Fade>

          <Headers table={table} />
        </Tfoot>
      </Table>
    </TableContainer>

    {table.getState().pagination && (
      <Pagination
        w="full"
        mt={[2, 4]}
        justifyContent="center"
        page={table.getState().pagination.pageIndex + 1}
        limit={table.getState().pagination.pageSize}
        total={table.getPageCount()}
        disabled={isLoading || isValidating}
        onPageChange={(page) => table.setPageIndex(page - 1)}
      />
    )}
  </>
)

export interface HeadersProps<T> {
  table: TTable<T>
}

function Headers<T>({ table }: HeadersProps<T>): JSX.Element {
  return (
    <>
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
                    asc: <ArrowUpIcon />,
                    desc: <ArrowDownIcon />,
                  }[header.column.getIsSorted() as string] ?? null}
                </Box>
              )}
            </Th>
          ))}
        </Tr>
      ))}
    </>
  )
}
