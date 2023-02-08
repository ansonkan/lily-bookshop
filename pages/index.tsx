import type { GetStaticProps, NextPage } from 'next'
import type { BookFE } from 'types'

import { Container, Flex } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { withSSRContext } from 'aws-amplify'

import {
  AboutSection,
  HighlightSection,
  LandingScene,
  LandingSection,
  LatestAdditionsSection,
} from 'components'

interface HomePageProps {
  highlights: BookFE[]
  latestAdditions: BookFE[]
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

          {highlights.length > 0 && (
            <HighlightSection
              rounded="3xl"
              overflow="hidden"
              boxShadow="xl"
              minH="350"
              // https://stackoverflow.com/questions/49066011/overflow-hidden-with-border-radius-not-working-on-safari
              isolation="isolate"
              books={highlights}
            />
          )}

          {latestAdditions.length > 0 && (
            <LatestAdditionsSection
              rounded="3xl"
              overflow="hidden"
              boxShadow="xl"
              minH="350"
              isolation="isolate"
              books={latestAdditions}
            />
          )}

          {/* add a `Random` section using `$sample`  */}

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
  const SSR = withSSRContext()

  const [translations, highlightsRes, latestRes] = await Promise.all([
    serverSideTranslations(locale ?? 'zh-HK', ['common']),
    SSR.API.get(
      'apicore',
      '/books?sort=highlight_order:1&limit=10&useThumbnailLink=1&sortOnlyExist=1'
    ),
    // SSR.API.get(
    //   'apicore',
    //   '/books?sort=date_restocked:-1&limit=10&useThumbnailLink=1&sortOnlyExist=1'
    // ),
    // Note: keep this simple for now, since I don't even know if Lily wants to continue this project or not
    SSR.API.get(
      'apicore',
      '/books?sort=date_created:-1&limit=10&useThumbnailLink=1'
    ),
  ])

  return {
    props: {
      ...translations,
      highlights: highlightsRes.books,
      latestAdditions: latestRes.books,
    },
    revalidate: 3600, // 1 hour
  }
}
