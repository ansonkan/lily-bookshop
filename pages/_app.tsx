import type { AppProps } from 'next/app'

import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'

import { Header, Footer } from '@components'
import { theme } from '@theme'

import styles from './_app.module.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
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

      <Header />

      <main className={styles.main}>
        <Component {...pageProps} />
      </main>

      <Footer />
    </ChakraProvider>
  )
}
