import type { GetStaticProps, NextPage } from 'next'

import { Button, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb, Kvp } from 'components'
import { ProtectedLayout } from 'layouts'

const CMSMyAccountPage: NextPage = () => {
  const { t } = useTranslation('cms')

  return (
    <ProtectedLayout>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
          { label: t('breadcrumb.manage-my-account'), href: '/cms/my-account' },
        ]}
      />

      <MyAccount />
    </ProtectedLayout>
  )
}

function MyAccount() {
  const { t } = useTranslation('cms')
  const { user, signOut } = useAuthenticator()

  return (
    <VStack alignItems="stretch">
      <Kvp k={t('my-account.id')}>{user?.username}</Kvp>

      <Kvp k={t('my-account.username')}>
        {user?.attributes?.preferred_username}
      </Kvp>

      <Kvp k={t('my-account.email')}>{user?.attributes?.email}</Kvp>

      <Kvp k={t('my-account.email-verified')}>
        {user?.attributes?.email_verified}
      </Kvp>

      <Button as={NextLink} href="/cms/my-account/change-password">
        {t('my-account.change-password.title')}
      </Button>

      <Button onClick={signOut} variant="outline">
        {t('cms.sign-out')}
      </Button>
    </VStack>
  )
}

export default CMSMyAccountPage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
    },
  }
}
