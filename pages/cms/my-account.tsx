import type { GetStaticProps, NextPage } from 'next'

import '@aws-amplify/ui-react/styles.css'
import { Button, VStack } from '@chakra-ui/react'
import { useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb, Kvp } from 'components'
import { BaseLayout } from 'layouts'

const CMSBooksPage: NextPage = () => {
  const { t } = useTranslation('cms')
  const { user, signOut } = useAuthenticator()

  return (
    <BaseLayout>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
          { label: t('breadcrumb.manage-my-account'), href: '/cms/my-account' },
        ]}
      />

      <VStack alignItems="stretch">
        <Kvp k={t('my-account.id')}>{user?.username}</Kvp>

        <Kvp k={t('my-account.username')}>
          {user?.attributes?.preferred_username}
        </Kvp>

        <Kvp k={t('my-account.email')}>{user?.attributes?.email}</Kvp>

        <Kvp k={t('my-account.email-verified')}>
          {user?.attributes?.email_verified}
        </Kvp>

        <Button onClick={signOut} variant="outline">
          {t('cms.sign-out')}
        </Button>
      </VStack>
    </BaseLayout>
  )
}

export default withAuthenticator(CMSBooksPage, { hideSignUp: true })

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
    },
  }
}
