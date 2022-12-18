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
  Text,
  Square,
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
        <Flex direction="column" gap={[8, 8, 10]}>
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
            color="white"
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

          <Box
            id="about"
            minH={[600, 500]}
            display="flex"
            flexDir={['column', 'row']}
            gap={4}
          >
            <Square flex={1} display="flex" flexDirection="column" gap={4}>
              <Heading textAlign="center">
                We are a second hand bookshop with{' '}
                <Text
                  as="span"
                  bgGradient="linear(to-tl, #00d9ff, #c700ff)"
                  bgClip="text"
                >
                  Style
                </Text>
              </Heading>

              <Text textAlign="center">
                Rare books, oversized books, novels, photography, children, art
                and many others. We have English, Chinese, Japanese and other
                European books. Please feel free to contact us and visit us!
              </Text>
            </Square>

            <Square
              flex={1}
              rounded="3xl"
              overflow="hidden"
              boxShadow="xl"
              as="iframe"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=Lily+Bookshop,Hong+Kong`}
            />
          </Box>
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
