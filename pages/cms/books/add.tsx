import type { GetStaticProps, NextPage } from 'next'

import type { NewBook } from 'features/cms/books/BookCreateForm'

import '@aws-amplify/ui-react/styles.css'
import { Heading } from '@chakra-ui/react'
import JSONCrush from 'jsoncrush'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { withAuthenticator } from '@aws-amplify/ui-react'

import { ArrowBreadcrumb } from 'components'
import { BaseLayout } from 'layouts'
import { BookCreateForm } from 'features/cms/books/BookCreateForm'
import { useMemo } from 'react'

const CMSBookAddPage: NextPage = () => {
  const { push, query, back } = useRouter()
  const { t } = useTranslation('cms')

  const initialBook: NewBook | undefined = useMemo(
    () =>
      query.book ? JSON.parse(JSONCrush.uncrush(query.book + '')) : undefined,
    [query.book]
  )

  return (
    <BaseLayout hideTopSlot>
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
        initialValues={initialBook}
        onCancel={() => {
          back()
        }}
        onSuccess={({ result: { insertedId } }) => {
          insertedId && push({ pathname: `/cms/books/${insertedId}` })
        }}
      />
    </BaseLayout>
  )
}

export default withAuthenticator(CMSBookAddPage, { hideSignUp: true })

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
    },
  }
}
