import type { GetStaticProps, NextPage } from 'next'

import '@aws-amplify/ui-react/styles.css'
import { Button, Heading, VStack } from '@chakra-ui/react'
import { useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react'
import NextLink from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb } from 'components'
import { BaseLayout } from 'layouts'

const CMSPage: NextPage = () => {
  const { t } = useTranslation('cms')

  return (
    <BaseLayout hideTopSlot>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
        ]}
      />

      <Heading>{t('breadcrumb.cms')}</Heading>

      <MainMenu />
    </BaseLayout>
  )
}

function MainMenu() {
  const { t } = useTranslation('cms')
  const { signOut } = useAuthenticator()

  return (
    <VStack alignItems="stretch" gap={4}>
      <Button as={NextLink} href="/cms/books" size="lg">
        {t('cms.manage-books')}
      </Button>

      {/* WIP */}
      <Button as={NextLink} href="/cms/articles" size="lg" disabled>
        {t('cms.manage-articles')}
      </Button>

      <Button as={NextLink} href="/cms/my-account" size="lg">
        {t('cms.manage-my-account')}
      </Button>

      <Button size="lg" variant="outline" onClick={signOut}>
        {t('cms.sign-out')}
      </Button>
    </VStack>
  )
}

export default withAuthenticator(CMSPage, { hideSignUp: true })

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
    },
  }
}
