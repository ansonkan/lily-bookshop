import type { NextPage } from 'next'

import { Box, Heading, Container } from '@chakra-ui/react'

import { LandingScene } from '@components'

const ZDogPage: NextPage = () => {
  return (
    <div>
      <Box position="relative" h="90vh" minH={500} maxH={1000}>
        <LandingScene />
      </Box>

      <Box minH={500}>
        <Container>
          <Heading>Highlights</Heading>
        </Container>
      </Box>

      <Box minH={500}>
        <Container>
          <Heading>Latest Additions</Heading>
        </Container>
      </Box>
    </div>
  )
}

export default ZDogPage
