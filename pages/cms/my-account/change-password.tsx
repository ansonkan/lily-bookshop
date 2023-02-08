import type { GetStaticProps, NextPage } from 'next'

import { Button, useToast } from '@chakra-ui/react'
import { AccountSettings } from '@aws-amplify/ui-react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb } from 'components'
import { ProtectedLayout } from 'layouts'

const CMSChangePasswordPage: NextPage = () => {
  const { t } = useTranslation('cms')

  return (
    <ProtectedLayout>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
          { label: t('breadcrumb.manage-my-account'), href: '/cms/my-account' },
          {
            label: t('breadcrumb.change-password'),
            href: '/cms/my-account/change-password',
          },
        ]}
      />

      <MyAccount />
    </ProtectedLayout>
  )
}

function MyAccount() {
  const { t } = useTranslation('cms')
  const toast = useToast()
  const { back } = useRouter()

  return (
    <>
      <AccountSettings.ChangePassword
        onSuccess={() =>
          toast({
            status: 'success',
            title: t('my-account.change-password.success'),
          })
        }
        onError={() => {
          toast({
            status: 'error',
            title: t('my-account.change-password.failed'),
          })
        }}
      />

      <Button onClick={() => back()} variant="ghost">
        {t('common.cancel')}
      </Button>
    </>
  )
}

export default CMSChangePasswordPage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
    },
  }
}
