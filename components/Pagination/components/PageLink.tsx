import { Button } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export interface PageLinkProps {
  page: number
  currentPage?: number
  disabled?: boolean
  onPageChange?: (page: number) => void
}

export const PageLink = ({
  page,
  currentPage,
  disabled,
  onPageChange,
}: PageLinkProps): JSX.Element => {
  const { pathname, query, locale } = useRouter()

  const commonProps = {
    locale: locale,
    disabled:
      disabled ||
      (onPageChange && currentPage !== undefined
        ? currentPage === page
        : `${page}` === (query.page ?? '1')),
  }

  if (onPageChange)
    return (
      <Button onClick={() => onPageChange(page)} {...commonProps}>
        {page}
      </Button>
    )

  return (
    <Button
      as={NextLink}
      href={{ pathname, query: { ...query, page } }}
      {...commonProps}
    >
      {page}
    </Button>
  )
}
