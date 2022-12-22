import type { Book } from 'types'
import type { CardProps } from '@chakra-ui/react'

// this doesn't cause any circular dependencies?
import { BookScrollXCard, LatestAdditionsScene } from 'components'

import styles from './styles.module.scss'

export interface LatestAdditionSectionProps extends CardProps {
  books: Book[]
}

export const LatestAdditionSection = ({
  books,
  ...cardProps
}: LatestAdditionSectionProps): JSX.Element => (
  <BookScrollXCard
    {...cardProps}
    heading="Latest Additions"
    books={books}
    color="white"
    headingClassName={styles.heading}
  >
    <LatestAdditionsScene />
  </BookScrollXCard>
)
