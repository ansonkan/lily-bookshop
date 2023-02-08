import type { BookFE } from 'types'
import type { LinkBoxProps } from '@chakra-ui/react'

export interface BookItemProps extends Omit<LinkBoxProps, 'id' | 'title'> {
  detailsLink?: string
  variant?: 'base' | 'detailed' | 'full'
  book: Omit<
    BookFE,
    'id' | 'user_created' | 'date_created' | 'user_updated' | 'date_updated'
  >
}
