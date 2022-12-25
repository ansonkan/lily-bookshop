import type { ButtonGroupProps } from '@chakra-ui/react'

import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

export interface PaginationProps extends ButtonGroupProps {
  // 1 based
  page: number
  limit: number
  total: number
  neighbors?: number
  getLink: (page: number) => string
}

export const Pagination = ({
  page,
  limit,
  total,
  neighbors = 4,
  getLink,
  ...others
}: PaginationProps): JSX.Element => {
  const lastPageInt = Math.ceil(total / limit)
  const neighborsEachSide = Math.round(neighbors / 2)

  const buttons = [
    <Button
      key={1}
      as={NextLink}
      href={getLink(1)}
      disabled={page === 1}
      leftIcon={<ArrowLeftIcon />}
    >
      First
    </Button>,
  ]

  const start = Math.max(page - neighborsEachSide, 2)
  const end = Math.min(page + neighborsEachSide, lastPageInt - 1)

  if (start !== 2) {
    buttons.push(<Text key="start-gap">...</Text>)
  }

  for (let i = start; i <= end; i++) {
    if (i > 1 && i < lastPageInt) {
      buttons.push(
        <Button key={i} as={NextLink} href={getLink(i)} disabled={page === i}>
          {i}
        </Button>
      )
    }
  }

  if (end !== lastPageInt - 1) {
    buttons.push(<Text key="end-gap">...</Text>)
  }

  buttons.push(
    <Button
      key={lastPageInt}
      as={NextLink}
      href={getLink(lastPageInt)}
      disabled={page === lastPageInt}
      rightIcon={<ArrowRightIcon />}
    >
      Last
    </Button>
  )

  return (
    <ButtonGroup {...others} size={['xs', 'sm']}>
      {buttons}
    </ButtonGroup>
  )
}
