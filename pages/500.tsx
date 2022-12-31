import type { GetStaticProps, NextPage } from 'next'

import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Custom500Page: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <div>
      <Head>
        <title>500 - {t('head.title')}</title>
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
