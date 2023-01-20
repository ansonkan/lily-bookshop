import type { GetStaticProps, NextPage } from 'next'

import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from '@aws-amplify/ui-react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb } from 'components'
import { BaseLayout } from 'layouts'

const CMS = dynamic(() => import('../features/cms/CMS').then((mod) => mod.CMS))

const CMSPage: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <BaseLayout>
      <Head>
        <title>{`CMS - ${t('head.title')}`}</title>
      </Head>

      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
        ]}
      />

      <Authenticator hideSignUp>{() => <CMS />}</Authenticator>
    </BaseLayout>
  )
}

export default CMSPage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
