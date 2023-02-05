import type { AspectRatioProps } from '@chakra-ui/react'

import { useEffect, useState } from 'react'
import { AspectRatio } from '@chakra-ui/react'
import Image from 'next/image'
import { Storage } from 'aws-amplify'

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
  const [link, setLink] = useState<string | undefined>()

  useEffect(() => {
    const getUploadedImage = async () => {
      if (src) {
        const file = await Storage.get(src, {
          level: 'public',
        })
        setLink(file)
      }
    }

    getUploadedImage()
  }, [src])

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
        src={link || placeholderImageSrc}
        alt={`Thumbnail of ${bookTitle}`}
        fill
      />
    </AspectRatio>
  )
}
