import type { Book, DirectusBook } from 'types'
import type { GetStaticProps, NextPage } from 'next'

import { Container, Flex } from '@chakra-ui/react'
import { MongoClient } from 'mongodb'
import { captureException } from '@sentry/nextjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import {
  AboutSection,
  HighlightSection,
  LandingScene,
  LandingSection,
  LatestAdditionSection,
} from 'components'
// import clientPromise from 'utils/mongodb'
import { formatDirectusBook } from 'utils'

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

          {highlights.length > 0 && (
            <HighlightSection
              rounded="3xl"
              overflow="hidden"
              boxShadow="xl"
              minH="500"
              // https://stackoverflow.com/questions/49066011/overflow-hidden-with-border-radius-not-working-on-safari
              isolation="isolate"
              books={highlights}
            />
          )}

          {latestAdditions.length > 0 && (
            <LatestAdditionSection
              rounded="3xl"
              overflow="hidden"
              boxShadow="xl"
              minH="500"
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

const LIMIT = 20

export const getStaticProps: GetStaticProps<HomePageProps> = async ({
  locale,
}) => {
  if (!process.env.MONGODB_URL_READ_ONLY) {
    throw new Error('Invalid/Missing environment variable')
  }

  const client = new MongoClient(process.env.MONGODB_URL_READ_ONLY)

  try {
    await client.connect()
    const books = client.db('bookshop').collection<DirectusBook>('books')

    const [tranResult, highResult, latestResult] = await Promise.allSettled([
      serverSideTranslations(locale ?? 'en', ['common']),
      books
        .find(
          { highlightOrder: { $ne: null }, quantity: { $gt: 0 } },
          { limit: LIMIT, sort: { highlightOrder: 'ascending' } }
        )
        .toArray(),
      books
        .find(
          { quantity: { $gt: 0 } },
          {
            limit: LIMIT,
            sort: { dateRestocked: 'descending', date_updated: 'descending' },
          }
        )
        .toArray(),
    ])

    return {
      props: {
        ...(tranResult.status === 'fulfilled' ? tranResult.value : {}),
        // need to cast books from `Directus`/`MongoDB Atlas` to `DirectusBook`, then remove all of the `null` properties
        highlights:
          highResult.status === 'fulfilled'
            ? highResult.value.map((v) => formatDirectusBook(v))
            : [],
        latestAdditions:
          latestResult.status === 'fulfilled'
            ? latestResult.value.map((v) => formatDirectusBook(v))
            : [],
      },
      revalidate: 60 * 15, // 15min
    }
  } catch (err) {
    captureException(err)
    throw err
  } finally {
    await client.close()
  }
}
