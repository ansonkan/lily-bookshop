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
          <Card rounded="3xl" overflow="hidden" boxShadow="xl" minH="500">
            <HighlightScene />

            <CardHeader>
              <Heading>Highlights</Heading>
            </CardHeader>

            <CardBody>something...</CardBody>
          </Card>

          <Card
            rounded="3xl"
            color="gray.100"
            overflow="hidden"
            boxShadow="xl"
            minH="500"
          >
            <LatestAdditionsScene />

            <CardHeader>
              <Heading>Latest Additions</Heading>
            </CardHeader>

            <CardBody>something...</CardBody>
          </Card>
        </Flex>
      </Container>
    </Flex>
  )
}

export default ZDogPage
