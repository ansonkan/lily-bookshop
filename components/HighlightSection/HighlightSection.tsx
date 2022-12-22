import type { Book } from 'types'
import type { CardProps } from '@chakra-ui/react'

import { BookScrollXCard, HighlightScene } from 'components'

import styles from './styles.module.scss'

export interface HighlightSectionProps extends CardProps {
  books: Book[]
}

export const HighlightSection = ({
  books,
  ...cardProps
}: HighlightSectionProps): JSX.Element => (
  <BookScrollXCard
    {...cardProps}
    heading="Latest Additions"
    books={books}
    headingClassName={styles.heading}
  >
    <HighlightScene />
  </BookScrollXCard>
)
