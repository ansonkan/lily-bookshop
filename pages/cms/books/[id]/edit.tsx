import type { GetServerSideProps, NextPage } from 'next'

import type { BookFE } from 'types'

import '@aws-amplify/ui-react/styles.css'
import { Heading } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { withSSRContext } from 'aws-amplify'

import { ArrowBreadcrumb } from 'components'
import { BaseLayout } from 'layouts'
import { BookEditForm } from 'features/cms/books/BookEditForm'

interface CMSBookEditPageProps {
  book: BookFE
}

const CMSBookEditPage: NextPage<CMSBookEditPageProps> = ({
  book,
}: CMSBookEditPageProps) => {
  const { push, query, back } = useRouter()
  const { t } = useTranslation('cms')

  return (
    <BaseLayout hideTopSlot>
      <ArrowBreadcrumb
        items={[
          { label: t('breadcrumb.home'), href: '/' },
          { label: t('breadcrumb.cms'), href: '/cms' },
          { label: t('breadcrumb.manage-books'), href: '/cms/books' },
          { label: query.id + '', href: `/cms/books/${query.id}` },
          {
            label: t('breadcrumb.edit-book'),
            href: `/cms/books/${query.id}/edit`,
          },
        ]}
      />

      <Heading>{t('breadcrumb.edit-book')}</Heading>

      <BookEditForm
        initialValues={{
          ...book,
          thumbnail: book.thumbnail
            ? [
                {
                  type: 's3-object',
                  key: book.thumbnail,
                  status: 'unchanged',
                },
              ]
            : undefined,
        }}
        onCancel={() => {
          back()
        }}
        onSuccess={() => {
          push({ pathname: `/cms/books/${query.id}` })
        }}
      />
    </BaseLayout>
  )
}

export default withAuthenticator(CMSBookEditPage, { hideSignUp: true })

export const getServerSideProps: GetServerSideProps<
  CMSBookEditPageProps,
  { id: string }
> = async ({ params, locale, req }) => {
  if (!params?.id) {
    return { notFound: true }
  }

  const SSR = withSSRContext({ req })

  const { book } = await SSR.API.get('apicore', `/books/${params.id}`)

  if (!book) {
    return { notFound: true }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-HK', ['common', 'cms'])),
      book: book,
    },
  }
}
