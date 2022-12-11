import { Box, Container, Heading } from '@chakra-ui/react'

export const Footer = (): JSX.Element => (
  <Box as="footer" bgColor="purple.800">
    <Container>
      <Heading color="white" size="md">
        Lily Bookshop
      </Heading>
    </Container>
  </Box>
)
