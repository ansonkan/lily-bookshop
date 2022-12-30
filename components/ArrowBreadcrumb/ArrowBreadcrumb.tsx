import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'

export interface ArrowBreadcrumbProps {
  items: Array<{
    href?: string
    label: string
  }>
}

export const ArrowBreadcrumb = ({
  items,
}: ArrowBreadcrumbProps): JSX.Element => (
  <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} fontSize="sm">
    {items.map(({ href, label }, i) => (
      <BreadcrumbItem
        key={`${href}-${label}`}
        overflow={i === items.length - 1 ? 'hidden' : undefined}
      >
        <BreadcrumbLink
          href={href}
          as={href ? NextLink : 'a'}
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          isCurrentPage={i === items.length - 1}
        >
          {label}
        </BreadcrumbLink>
      </BreadcrumbItem>
    ))}
  </Breadcrumb>
)
