import type { AppProps } from 'next/app'

import { Box, ChakraProvider } from '@chakra-ui/react'
import { appWithTranslation, useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Footer, Header, SearchModal, SearchModalProvider } from 'components'
import { theme } from 'theme'

import './globals.scss'
import nextI18NextConfig from '../next-i18next.config'

function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation('common')
  const { pathname } = useRouter()

  return (
    <ChakraProvider theme={theme}>
      <SearchModalProvider>
        <Head>
          <title>{t('head.title')}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>

        <Header showAllThreshold={pathname === '/' ? undefined : 50} />

        <Box as="main" minH="100vh" overflowX="hidden" pb={20}>
          <Component {...pageProps} />
        </Box>

        <Footer />

        <SearchModal />
      </SearchModalProvider>
    </ChakraProvider>
  )
}

export default appWithTranslation(App, nextI18NextConfig)
