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

            <CardBody
              display="flex"
              flexDir="row"
              alignItems="stretch"
              gap={4}
              overflowX="scroll"
            >
              {highlight.map(({ id, ...others }) => (
                <Book
                  key={id}
                  w={[150, 200]}
                  flexShrink={0}
                  flexGrow={0}
                  {...others}
                />
              ))}
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

            <CardBody display="flex" flexDir="row" gap={4} overflowX="scroll">
              {latestAdditions.map(({ id, ...others }) => (
                <Book
                  key={id}
                  w={[150, 200]}
                  flexShrink={0}
                  flexGrow={0}
                  {...others}
                />
              ))}
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
      highlight: many(fakeBook, 12),
      latestAdditions: many(fakeBook, 12),
    },
  }
}
