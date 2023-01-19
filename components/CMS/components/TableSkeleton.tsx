import { Skeleton, Td, Tr } from '@chakra-ui/react'
import { memo } from 'react'

import { V } from '../../Kvp'

export interface TableSkeletonProps {
  row: number
  col: number
  dummyFn?: () => JSX.Element
}

export const TableSkeleton = memo(({ row, col, dummyFn = () => <V useBadge>
      Loading
    </V> }: TableSkeletonProps): JSX.Element => {
  return (
    <>
      {Array(row)
        .fill(0)
        .map((_, y) => (
          <Tr key={y}>
            {Array(col)
              .fill(0)
              .map((_, x) => (
                <Td key={x}>
                  <Skeleton>{dummyFn()}</Skeleton>
                </Td>
              ))}
          </Tr>
        ))}
    </>
  )
})

TableSkeleton.displayName = 'TableSkeleton'
