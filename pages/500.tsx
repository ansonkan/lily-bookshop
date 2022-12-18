import type { NextPage } from 'next'

import Head from 'next/head'

const Custom500Page: NextPage = () => {
  return (
    <div>
      <Head>
        <title>500 | Lily Bookshop</title>
        <meta
          name="description"
          content="Lily Bookshop, 500, Server-side error occurred"
        />
      </Head>

      <h1>500 - Server-side error occurred</h1>
    </div>
  )
}

export default Custom500Page
