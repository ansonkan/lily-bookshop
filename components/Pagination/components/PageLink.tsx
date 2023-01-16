import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export interface PageLinkProps {
  page: number
  currentPage?: number
  isLastPage?: boolean
  onPageChange?: (page: number) => void
}

export const PageLink = ({
  page,
  currentPage,
  isLastPage,
  onPageChange,
}: PageLinkProps): JSX.Element => {
  const { pathname, query, locale } = useRouter()
  const { t } = useTranslation('common')

  const commonProps = {
    locale: locale,
    disabled:
      onPageChange && currentPage !== undefined
        ? currentPage === page
        : `${page}` === (query.page ?? '1'),
    leftIcon: page === 1 ? <ArrowLeftIcon /> : undefined,
    rightIcon: isLastPage ? <ArrowRightIcon /> : undefined,
  }

  const content =
    page === 1
      ? t('pagination.first')
      : isLastPage
      ? t('pagination.last')
      : page

  if (onPageChange)
    return (
      <Button onClick={() => onPageChange(page)} {...commonProps}>
        {content}
      </Button>
    )

  return (
    <Button
      as={NextLink}
      href={{ pathname, query: { ...query, page } }}
      {...commonProps}
    >
      {content}
    </Button>
  )
}
