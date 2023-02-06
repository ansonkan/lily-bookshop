import type { ComponentProps } from 'react'

import { Skeleton, Td, Tr } from '@chakra-ui/react'
import { memo } from 'react'

export interface TableSkeletonProps {
  row: number
  col: number
  rowHeight?: ComponentProps<typeof Td>['h']
}

// '41px' is a hardcoded value which is the `ButtonGroup` height
export const TableSkeleton = memo(
  ({ row, col, rowHeight = '72.5px' }: TableSkeletonProps): JSX.Element => {
    return (
      <>
        {Array(row)
          .fill(0)
          .map((_, y) => (
            <Tr key={y}>
              {Array(col)
                .fill(0)
                .map((_, x) => (
                  <Td key={x} h={rowHeight} position="relative">
                    <Skeleton w="full" h="full" />
                  </Td>
                ))}
            </Tr>
          ))}
      </>
    )
  }
)

TableSkeleton.displayName = 'TableSkeleton'
