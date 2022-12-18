import type { CenterProps } from '@chakra-ui/react'

import {
  Center,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
  Button,
  ButtonGroup,
  Link,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

export const LandingSection = (props: CenterProps): JSX.Element => (
  <Center {...props}>
    <Flex direction="column" gap={4}>
      <Heading
        as="h1"
        fontSize={['2xl', '4xl', '4xl', '5xl']}
        textAlign="center"
      >
        Looking for your next book?
      </Heading>

      <InputGroup backdropFilter="auto" backdropBlur="sm">
        <InputLeftElement>
          <SearchIcon />
        </InputLeftElement>
        <Input placeholder="A title, author, ISBN, or anything really..." />
      </InputGroup>

      <ButtonGroup alignSelf="center">
        <Button as={Link} href="#about">
          Visit us
        </Button>
        <Button>Check out our blog</Button>
      </ButtonGroup>
    </Flex>
  </Center>
)
