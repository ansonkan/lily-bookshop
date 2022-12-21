import type { CenterProps } from '@chakra-ui/react'

import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  Link,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useContext } from 'react'

import { SearchModalContext } from '../SearchModal'

export const LandingSection = (props: CenterProps): JSX.Element => {
  const { onOpen } = useContext(SearchModalContext)

  return (
    <Center {...props}>
      <Flex direction="column" gap={4}>
        <Heading
          as="h1"
          fontSize={['2xl', '4xl', '4xl', '5xl']}
          textAlign="center"
        >
          Looking for your next book?
        </Heading>

        <Button
          variant="outline"
          onClick={() => onOpen()}
          leftIcon={<SearchIcon color="ButtonText" />}
          justifyContent="flex-start"
          color="chakra-placeholder-color"
          fontWeight="normal"
        >
          A title, author, ISBN, or anything really...
        </Button>

        <ButtonGroup alignSelf="center">
          <Button as={Link} href="#about">
            Visit us
          </Button>
          <Button>Check out our blog</Button>
        </ButtonGroup>
      </Flex>
    </Center>
  )
}
