import { Heading, Text, VStack } from '@chakra-ui/react'

export interface SectionProps {
  heading: string
  children?: string
}

export const Section = ({ heading, children }: SectionProps): JSX.Element => {
  if (!children) return <></>

  return (
    <VStack alignItems="flex-start">
      <Heading size="md">{heading}</Heading>

      {children.split('\n').map((paragraph, i) => (
        <Text fontSize="small" key={i}>
          {paragraph}
        </Text>
      ))}
    </VStack>
  )
}
