import type { AppProps } from 'next/app'

import { Box, ChakraProvider, Fade, Progress } from '@chakra-ui/react'
import { appWithTranslation, useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { Amplify } from 'aws-amplify'
import Head from 'next/head'
import { useRouter } from 'next/router'

/**
 * It seems importing from `components/index.ts` is not tree-shakable.
 * Might even only in this `_app.tsx` because I've tried replacing
 * `components` imports in other pages but it didn't change the bundle size.
 *
 * Changing from "import {...} from 'components'" to "import {...} from 'components/XXX'",
 * reduce the "First Load JS shared by all" from 1.2 MB -> 257 kB
 */
import { SearchModal, SearchModalProvider } from 'components/SearchModal'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import awsConfig from 'src/aws-exports'
import { theme } from 'theme'

import './globals.scss'
import nextI18NextConfig from '../next-i18next.config'

Amplify.configure({ ...awsConfig, ssr: true })

function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation('common')
  const { pathname, events } = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const start = () => setIsLoading(true)
    const end = () => setIsLoading(false)
    events.on('routeChangeStart', start)
    events.on('routeChangeComplete', end)
    events.on('routeChangeError', end)

    return () => {
      events.off('routeChangeStart', start)
      events.off('routeChangeComplete', end)
      events.off('routeChangeError', end)
    }
  }, [events])

  return (
    <ChakraProvider theme={theme}>
      <SearchModalProvider>
        <Head>
          <title>{t('head.title')}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>

        <Fade in={isLoading} unmountOnExit>
          <Progress
            size="sm"
            isIndeterminate
            position="fixed"
            w="full"
            zIndex="overlay"
            background="transparent"
            colorScheme="purple"
          />
        </Fade>

        <Header showAllThreshold={pathname === '/' ? undefined : 50} />

        <Box as="main" minH="100vh" pb={20}>
          <Component {...pageProps} />
        </Box>

        <Footer />

        <SearchModal />
      </SearchModalProvider>
    </ChakraProvider>
  )
}

export default appWithTranslation(App, nextI18NextConfig)
