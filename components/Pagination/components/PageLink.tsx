import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export interface PageLinkProps {
  page: number
  isLastPage?: boolean
}

export const PageLink = ({ page, isLastPage }: PageLinkProps): JSX.Element => {
  const { pathname, query, locale } = useRouter()
  const { t } = useTranslation('common')

  return (
    <Button
      key={1}
      as={NextLink}
      href={{ pathname, query: { ...query, page } }}
      locale={locale}
      disabled={`${page}` === (query.page ?? '1')}
      leftIcon={page === 1 ? <ArrowLeftIcon /> : undefined}
      rightIcon={isLastPage ? <ArrowRightIcon /> : undefined}
    >
      {page === 1
        ? t('pagination.first')
        : isLastPage
        ? t('pagination.last')
        : page}
    </Button>
  )
}
