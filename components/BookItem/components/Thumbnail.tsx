import type { AspectRatioProps } from '@chakra-ui/react'

import { AspectRatio } from '@chakra-ui/react'
import Image from 'next/image'

import placeholderImageSrc from 'public/placeholder-image.png'

export interface ThumbnailProps extends AspectRatioProps {
  bookTitle: string
  src?: string
}

export const Thumbnail = ({
  bookTitle,
  src,
  ...others
}: ThumbnailProps): JSX.Element => {
  return (
    <AspectRatio
      ratio={1 / 1.5}
      w="full"
      bgColor="gray.100"
      rounded="3xl"
      overflow="hidden"
      {...others}
    >
      <Image
        src={src || placeholderImageSrc}
        alt={`Thumbnail of ${bookTitle}`}
        fill
      />
    </AspectRatio>
  )
}
