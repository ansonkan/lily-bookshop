import type { IconProps } from '@chakra-ui/icons'
import type { TypographyProps } from '@chakra-ui/react'

import { Badge, Flex, Text } from '@chakra-ui/react'
import { CheckCircleIcon, CloseIcon, MinusIcon } from '@chakra-ui/icons'

export interface KvpProps {
  k: string
  children?: string | number | string[] | number[] | boolean
  useBadge?: boolean
  fontSize?: TypographyProps['fontSize']
}

interface VHelperProps {
  children: string | number | boolean
  useBadge?: boolean
  fontSize?: TypographyProps['fontSize']
}

const VHelper = ({
  children,
  useBadge,
  fontSize = 'md',
}: VHelperProps): JSX.Element => {
  const Component = useBadge ? Badge : Text
  return (
    <Component
      as="dd"
      fontSize={fontSize}
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      maxW={400}
      title={children ? `${children}` : undefined}
    >
      {typeof children === 'boolean' ? (
        children ? (
          <CheckCircleIcon color="green" />
        ) : (
          <CloseIcon color="red" />
        )
      ) : (
        children
      )}
    </Component>
  )
}

export const None = (props: IconProps) => (
  <MinusIcon as="dd" role="none" color="gray.300" {...props} />
)

export const V = ({
  children,
  useBadge,
  fontSize,
}: Omit<KvpProps, 'k'>): JSX.Element => {
  if (children === undefined || children === '') return <None />

  if (Array.isArray(children)) {
    if (children.length === 0) return <None />

    return (
      <>
        {children.map((item) => (
          <VHelper key={item} useBadge={useBadge} fontSize={fontSize}>
            {item}
          </VHelper>
        ))}
      </>
    )
  }

  return <VHelper useBadge={useBadge}>{children}</VHelper>
}

export const Kvp = ({ k, children, useBadge }: KvpProps): JSX.Element => {
  return (
    <Flex direction="column">
      <Text fontSize="sm" color="gray" as="dt">
        {k}
      </Text>

      <Flex gap={1} wrap="wrap">
        <V useBadge={useBadge}>{children}</V>
      </Flex>
    </Flex>
  )
}
