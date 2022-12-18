import type { IconProps } from '@chakra-ui/icons'

import { Icon } from '@chakra-ui/icons'

export const MapPinIcon = (props: IconProps): JSX.Element => {
  return (
    <Icon viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M128.1 16a88.1 88.1 0 0 0-88 88c0 75.3 80 132.2 83.4 134.6a8.3 8.3 0 0 0 9.2 0c3.4-2.4 83.4-59.3 83.4-134.6a88.1 88.1 0 0 0-88-88Zm0 56a32 32 0 1 1-32 32a32 32 0 0 1 32-32Z"
      />
    </Icon>
  )
}
