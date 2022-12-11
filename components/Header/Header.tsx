import { Box, Container, Heading } from '@chakra-ui/react'

export const Header = (): JSX.Element => (
  <Box
    as="header"
    position="sticky"
    top="0"
    backdropFilter="auto"
    backdropBlur="sm"
    bgColor="whiteAlpha.500"
    borderBottom="1px"
    borderColor="whiteAlpha.500"
    zIndex="sticky"
  >
    <Container>
      <Heading size="md">Lily Bookshop</Heading>
    </Container>
  </Box>
)
