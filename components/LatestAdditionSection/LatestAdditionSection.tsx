import type { Book } from 'types'
import type { CardProps } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

// this doesn't cause any circular dependencies?
import { BookScrollXCard, LatestAdditionsScene } from 'components'

import styles from './styles.module.scss'

export interface LatestAdditionSectionProps extends CardProps {
  books: Book[]
}

export const LatestAdditionSection = ({
  books,
  ...cardProps
}: LatestAdditionSectionProps): JSX.Element => {
  const { t } = useTranslation('common')

  return (
    <BookScrollXCard
      {...cardProps}
      heading={t('latest-addition-section.heading')}
      books={books}
      color="white"
      headingClassName={styles.heading}
    >
      <LatestAdditionsScene />
    </BookScrollXCard>
  )
}
