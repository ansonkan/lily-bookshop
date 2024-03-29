import type { GetStaticProps, NextPage } from 'next'

import { Heading } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { ArrowBreadcrumb } from 'components'
import { BookCreateForm } from 'features/cms/books/BookCreateForm'
import { ProtectedLayout } from 'layouts'

const CMSBookAddPage: NextPage = () => {
  const { push, back } = useRouter()
  const { t } = useTranslation('cms')

  return (
    <ProtectedLayout>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
          { label: t('breadcrumb.manage-books'), href: '/cms/books' },
          {
            label: t('breadcrumb.add-book'),
            href: '/cms/books/add',
          },
        ]}
      />

      <Heading>{t('breadcrumb.add-book')}</Heading>

      <BookCreateForm
        onCancel={() => {
          back()
        }}
        onSuccess={({ result: { insertedId } }) => {
          /**
           * TODO: Use `toast` + 'button' to allow user click on it like 'Create another one?'
           * https://github.com/chakra-ui/chakra-ui/issues/849
           */
          insertedId && push({ pathname: `/cms/books/${insertedId}` })
        }}
      />
    </ProtectedLayout>
  )
}

export default CMSBookAddPage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
    },
  }
}
