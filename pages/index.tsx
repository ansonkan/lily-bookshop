import type { NextPage } from 'next'

import {
  Box,
  Heading,
  Container,
  Card,
  CardHeader,
  CardBody,
  Flex,
} from '@chakra-ui/react'

import { LandingScene, HighlightScene, LatestAdditionsScene } from '@components'

const ZDogPage: NextPage = () => {
  return (
    <Flex direction="column" gap={4} pb={8}>
      <Box position="relative" h="80vh" minH={500} maxH={1000}>
        <LandingScene />
      </Box>

      <Container>
        <Flex direction="column" gap={8}>
          <Card
            rounded="3xl"
            overflow="hidden"
            boxShadow="xl"
            minH="500"
            // https://stackoverflow.com/questions/49066011/overflow-hidden-with-border-radius-not-working-on-safari
            isolation="isolate"
          >
            <HighlightScene />

            <CardHeader>
              <Heading textShadow="1px 1px #f3b259">Highlights</Heading>
            </CardHeader>

            <CardBody>something...</CardBody>
          </Card>

          <Card
            rounded="3xl"
            color="gray.100"
            overflow="hidden"
            boxShadow="xl"
            minH="500"
            isolation="isolate"
          >
            <LatestAdditionsScene />

            <CardHeader>
              <Heading textShadow="1px 1px #86c384">Latest Additions</Heading>
            </CardHeader>

            <CardBody>something...</CardBody>
          </Card>
        </Flex>
      </Container>
    </Flex>
  )
}

export default ZDogPage
