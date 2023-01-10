import type { BookFE } from 'types'
import type { CardProps } from '@chakra-ui/react'

import { useTranslation } from 'next-i18next'

import { BookScrollXCard } from '../BookScrollXCard'
import { HighlightScene } from '../HighlightScene'
import styles from './styles.module.scss'

export interface HighlightSectionProps extends CardProps {
  books: BookFE[]
}

export const HighlightSection = ({
  books,
  ...cardProps
}: HighlightSectionProps): JSX.Element => {
  const { t } = useTranslation('common')

  return (
    <BookScrollXCard
      {...cardProps}
      heading={t('highlight-section.heading')}
      books={books}
      headingClassName={styles.heading}
    >
      <HighlightScene />
    </BookScrollXCard>
  )
}
