import type { CardProps } from '@chakra-ui/react'
import type { RealBook } from '@types'

import { Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'

import { HighlightScene, Book } from '@components'

import styles from './styles.module.scss'

export interface HighlightSectionProps extends CardProps {
  books: RealBook[]
}

export const HighlightSection = ({
  books,
  ...cardProps
}: HighlightSectionProps): JSX.Element => (
  <Card {...cardProps}>
    <HighlightScene />

    <CardHeader>
      <Heading className={styles.heading}>Highlights</Heading>
    </CardHeader>

    <CardBody
      display="flex"
      flexDir="row"
      alignItems="stretch"
      gap={4}
      overflowX="scroll"
    >
      {books.map(({ id, ...others }) => (
        <Book key={id} w={[125, 150]} flexShrink={0} flexGrow={0} {...others} />
      ))}
    </CardBody>
  </Card>
)
