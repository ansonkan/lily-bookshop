import type { Book } from 'types'
import type { LinkBoxProps } from '@chakra-ui/react'

export interface BookItemProps extends Omit<LinkBoxProps, 'id' | 'title'> {
  detailsLink: string
  variant?: 'base' | 'detailed' | 'full'
  book: Book
}
