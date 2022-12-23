import type { Book } from 'types'
import type { LinkBoxProps } from '@chakra-ui/react'

export interface BookItemProps
  extends Omit<LinkBoxProps, 'id' | 'title'>,
    Book {
  detailsLink: string
  variant?: 'base' | 'detailed'
}
