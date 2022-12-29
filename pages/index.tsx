import type { GetStaticProps, NextPage } from 'next'
import type { Book } from 'types'

import { Container, Flex } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import {
  AboutSection,
  HighlightSection,
  LandingScene,
  LandingSection,
  LatestAdditionSection,
} from 'components'
import { fakeBook, many } from 'utils'

interface HomePageProps {
  highlights: Book[]
  latestAdditions: Book[]
}

const HomePage: NextPage<HomePageProps> = ({
  highlights,
  latestAdditions,
}: HomePageProps) => {
  return (
    <Flex direction="column" gap={4}>
      <LandingScene />

      <Container>
        <Flex direction="column" gap={[8, 8, 12]}>
          <LandingSection h="80vh" minH={500} maxH={700} />

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

export const getStaticProps: GetStaticProps<HomePageProps> = async ({
  locale,
}) => {
  // const apiUrl = process.env.API_URL

  // if (!apiUrl) throw new Error('Something went wrong...')

  // const results = await Promise.allSettled([
  //   fetch(`${apiUrl}/books?limit=3`),
  //   fetch(`${apiUrl}/books?limit=6&sort=searched_count&order=desc`),
  //   fetch(`${apiUrl}/books?limit=6&sort=average_rating&order=desc`),
  // ])

  const translations = await serverSideTranslations(locale ?? 'en', ['common'])

  return {
    props: {
      ...translations,
      highlights: many(fakeBook, 12),
      latestAdditions: many(fakeBook, 12),
    },
    revalidate: 60 * 15, // 15min
  }
}
