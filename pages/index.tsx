import type { NextPage, GetServerSideProps } from 'next'
import type { RealBook } from '@types'

import {
  Box,
  Heading,
  Container,
  Card,
  CardHeader,
  CardBody,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react'

import {
  LandingScene,
  HighlightScene,
  LatestAdditionsScene,
  Book,
} from '@components'
import { fakeBook, many } from '@utils'

interface HomePageProps {
  highlight: RealBook[]
  latestAdditions: RealBook[]
}

const HomePage: NextPage<HomePageProps> = ({ highlight, latestAdditions }) => {
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

            <CardBody>
              <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
                {highlight.map(({ id, ...others }) => (
                  <Book key={id} {...others} />
                ))}
              </SimpleGrid>
            </CardBody>
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

            <CardBody>
              <SimpleGrid columns={[2, null, 3, 4]} spacing={4}>
                {latestAdditions.map(({ id, ...others }) => (
                  <Book key={id} {...others} />
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>
        </Flex>
      </Container>
    </Flex>
  )
}

export default HomePage

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({
  res,
}) => {
  // const apiUrl = process.env.API_URL

  // if (!apiUrl) throw new Error('Something went wrong...')

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=86400'
  )

  // const results = await Promise.allSettled([
  //   fetch(`${apiUrl}/books?limit=3`),
  //   fetch(`${apiUrl}/books?limit=6&sort=searched_count&order=desc`),
  //   fetch(`${apiUrl}/books?limit=6&sort=average_rating&order=desc`),
  // ])

  return {
    props: {
      highlight: many(fakeBook),
      latestAdditions: many(fakeBook),
    },
  }
}
