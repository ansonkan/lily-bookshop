import type { ButtonGroupProps } from '@chakra-ui/react'

import { ButtonGroup, Text } from '@chakra-ui/react'

import { PageLink } from './components'

export interface PaginationProps extends ButtonGroupProps {
  // 1 based
  page: number
  limit: number
  total: number
  neighbors?: number
}
export const Pagination = ({
  page,
  limit,
  total,
  neighbors = 4,
  ...others
}: PaginationProps): JSX.Element => {
  const lastPageInt = Math.ceil(total / limit)
  const neighborsEachSide = Math.round(neighbors / 2)

  const buttons = [<PageLink key={1} page={1} />]

  const start = Math.max(page - neighborsEachSide, 2)
  const end = Math.min(page + neighborsEachSide, lastPageInt - 1)

  if (start !== 2) {
    buttons.push(<Text key="start-gap">...</Text>)
  }

  for (let i = start; i <= end; i++) {
    if (i > 1 && i < lastPageInt) {
      buttons.push(<PageLink key={i} page={i} />)
    }
  }

  if (end !== lastPageInt - 1) {
    buttons.push(<Text key="end-gap">...</Text>)
  }

  buttons.push(<PageLink key={lastPageInt} page={lastPageInt} isLastPage />)

  return (
    <ButtonGroup {...others} size={['xs', 'sm']}>
      {buttons}
    </ButtonGroup>
  )
}
