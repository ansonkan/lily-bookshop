import type { AppProps } from 'next/app'

import { Box, ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'

import './globals.scss'
import { Footer, Header, SearchModal, SearchModalProvider } from 'components'
import { theme } from 'theme'

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SearchModalProvider>
        <Head>
          <title>Lily Bookshop</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
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

        {/* home page is fine for `fixed` because of the Zdog scene setup but other pages can use a `sticky` header for easier top offset for the main `Container` */}
        <Header position={router.pathname === '/' ? 'fixed' : 'sticky'} />

        <Box as="main" minH="100vh" overflowX="hidden" pb={20}>
          <Component {...pageProps} />
        </Box>

        <Footer />

        <SearchModal />
      </SearchModalProvider>
    </ChakraProvider>
  )
}
