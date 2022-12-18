import { Box, Container, Heading, HStack } from '@chakra-ui/react'

export const Header = (): JSX.Element => (
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
      <HStack>
        <Heading size="md">Lily Bookshop</Heading>
      </HStack>
    </Container>
  </Box>
)
