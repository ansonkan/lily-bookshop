import type { NextPage, GetServerSideProps } from 'next'
import type { RealBook } from '@types'

import { Container, Flex } from '@chakra-ui/react'

import {
  LandingScene,
  LandingSection,
  HighlightSection,
  LatestAdditionSection,
  AboutSection,
} from '@components'
import { fakeBook, many } from '@utils'

interface HomePageProps {
  highlights: RealBook[]
  latestAdditions: RealBook[]
}

const HomePage: NextPage<HomePageProps> = ({ highlights, latestAdditions }) => {
  return (
    <Flex direction="column" gap={4}>
      <LandingScene />

      <Container>
        <Flex direction="column" gap={[8, 8, 12]}>
          <LandingSection h="80vh" minH={500} maxH={1000} />

          <HighlightSection
            rounded="3xl"
            overflow="hidden"
            boxShadow="xl"
            minH="500"
            // https://stackoverflow.com/questions/49066011/overflow-hidden-with-border-radius-not-working-on-safari
            isolation="isolate"
            books={highlights}
          />

          <LatestAdditionSection
            rounded="3xl"
            color="white"
            overflow="hidden"
            boxShadow="xl"
            minH="500"
            isolation="isolate"
            books={latestAdditions}
          />

          <AboutSection
            id="about"
            minH={[600, 500]}
            display="flex"
            flexDir={['column', 'row']}
            gap={4}
          />
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
      highlights: many(fakeBook, 12),
      latestAdditions: many(fakeBook, 12),
    },
  }
}
