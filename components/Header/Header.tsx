import { Box, Button, Container, HStack, Heading } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useContext } from 'react'

import { SearchModalContext } from '../SearchModal'

export const Header = (): JSX.Element => {
  const { onOpen } = useContext(SearchModalContext)

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      backdropFilter="auto"
      backdropBlur="sm"
      bgColor="whiteAlpha.500"
      borderBottom="1px"
      borderColor="whiteAlpha.500"
      zIndex="sticky"
    >
      <Container py={4}>
        <HStack justifyContent="space-between">
          <Heading size="md">Lily Bookshop</Heading>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpen()}
            leftIcon={<SearchIcon />}
          >
            Search
          </Button>
        </HStack>
      </Container>
    </Box>
  )
}
