import { Heading, Text, VStack } from '@chakra-ui/react'

export interface SectionProps {
  heading: string
  children?: React.ReactNode
}

export const Section = ({ heading, children }: SectionProps): JSX.Element => {
  if (!children) return <></>

  return (
    <VStack alignItems="flex-start">
      <Heading size="md">{heading}</Heading>

      {typeof children === 'string'
        ? children
            .split('\n')
            .map((paragraph, i) => <Text key={i}>{paragraph}</Text>)
        : children}
    </VStack>
  )
}
