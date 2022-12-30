import { Badge, Flex, Text } from '@chakra-ui/react'
import { MinusIcon } from '@chakra-ui/icons'

export interface KvpProps {
  k: string
  children?: string | number | string[] | number[]
  useBadge?: boolean
}

interface VHelperProps {
  children: string | number
  useBadge?: boolean
}

const VHelper = ({ children, useBadge }: VHelperProps): JSX.Element =>
  useBadge ? <Badge as="dd">{children}</Badge> : <Text as="dd">{children}</Text>

const V = ({
  children,
  useBadge,
}: Pick<KvpProps, 'children' | 'useBadge'>): JSX.Element => {
  if (children === undefined || children === '')
    return <MinusIcon as="dd" role="none" />

  if (Array.isArray(children)) {
    if (children.length === 0) return <MinusIcon as="dd" role="none" />

    return (
      <>
        {children.map((item) => (
          <VHelper key={item} useBadge={useBadge}>
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
      <Text fontSize="xs" color="gray" as="dt">
        {k}
      </Text>

      <Flex gap={1} wrap="wrap">
        <V useBadge={useBadge}>{children}</V>
      </Flex>
    </Flex>
  )
}
