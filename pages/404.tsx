import type { GetStaticProps, NextPage } from 'next'

import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Custom404Page: NextPage = () => {
  const { t } = useTranslation('common')

  /**
   * Otherwise:
   * Warning: A title element received an array with more than 1 element as children.
   *
   * don't know why
   */
  const title = `404 - ${t('head.title')}`

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Lily Bookshop, 404, Page Not Found" />
      </Head>

      <h1>404 - Page Not Found</h1>
    </div>
  )
}

export default Custom404Page

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
