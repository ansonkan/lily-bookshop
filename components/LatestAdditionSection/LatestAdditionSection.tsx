import type { CardProps } from '@chakra-ui/react'
import type { RealBook } from '@types'

import { Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'

import { LatestAdditionsScene, Book } from '@components'

import styles from './styles.module.scss'

export interface LatestAdditionSectionProps extends CardProps {
  books: RealBook[]
}

export const LatestAdditionSection = ({
  books,
  ...cardProps
}: LatestAdditionSectionProps): JSX.Element => (
  <Card {...cardProps} color="white">
    <LatestAdditionsScene />

    <CardHeader>
      <Heading className={styles.heading}>Latest Additions</Heading>
    </CardHeader>

    <CardBody display="flex" flexDir="row" gap={4} overflowX="scroll">
      {books.map(({ id, ...others }) => (
        <Book key={id} w={[150, 200]} flexShrink={0} flexGrow={0} {...others} />
      ))}
    </CardBody>
  </Card>
)
