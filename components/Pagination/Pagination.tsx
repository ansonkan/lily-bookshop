import type { ButtonGroupProps } from '@chakra-ui/react'

import { ButtonGroup, Text } from '@chakra-ui/react'

import { PageLink } from './components'

export interface PaginationProps extends ButtonGroupProps {
  // 1 based
  page: number
  limit: number
  total: number
  neighbors?: number
  disabled?: boolean
  onPageChange?: (page: number) => void
}
export const Pagination = ({
  page,
  limit,
  total,
  neighbors = 4,
  disabled,
  onPageChange,
  ...others
}: PaginationProps): JSX.Element => {
  if (!total || total <= limit) return <></>

  const lastPageInt = Math.ceil(total / limit)
  const neighborsEachSide = Math.round(neighbors / 2)

  const buttons = [
    <PageLink
      key={1}
      page={1}
      currentPage={page}
      disabled={disabled}
      onPageChange={onPageChange}
    />,
  ]

  const start = Math.max(page - neighborsEachSide, 2)
  const end = Math.min(page + neighborsEachSide, lastPageInt - 1)

  if (start !== 2) {
    buttons.push(<Text key="start-gap">...</Text>)
  }

  for (let i = start; i <= end; i++) {
    if (i > 1 && i < lastPageInt) {
      buttons.push(
        <PageLink
          key={i}
          page={i}
          currentPage={page}
          disabled={disabled}
          onPageChange={onPageChange}
        />
      )
    }
  }

  if (end !== lastPageInt - 1) {
    buttons.push(<Text key="end-gap">...</Text>)
  }

  buttons.push(
    <PageLink
      key={lastPageInt}
      page={lastPageInt}
      currentPage={page}
      disabled={disabled}
      onPageChange={onPageChange}
    />
  )

  return <ButtonGroup {...others}>{buttons}</ButtonGroup>
}
