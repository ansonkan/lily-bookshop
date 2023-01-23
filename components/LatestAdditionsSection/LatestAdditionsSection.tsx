import type { BookFE } from 'types'
import type { CardProps } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

import { BookScrollXCard } from '../BookScrollXCard'
import { LatestAdditionsScene } from '../LatestAdditionsScene'
import styles from './styles.module.scss'

export interface LatestAdditionsSectionProps extends CardProps {
  books: BookFE[]
}

export const LatestAdditionsSection = ({
  books,
  ...cardProps
}: LatestAdditionsSectionProps): JSX.Element => {
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
