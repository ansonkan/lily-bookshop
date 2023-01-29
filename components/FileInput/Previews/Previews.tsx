import { Center, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import { useRef } from 'react'

import { returnFileSize } from '../utils'
import styles from './styles.module.scss'

export interface PreviewsProps {
  files: File[]
  onDelete: (file: File) => void
}

export const Previews = ({ files, onDelete }: PreviewsProps) => {
  const imageUrlMap = useRef(new Map<File, string>())

  return (
    <VStack alignItems="stretch">
      {files?.map((f, index) => {
        if (!imageUrlMap.current.has(f) && f.type.startsWith('image')) {
          imageUrlMap.current.set(f, URL.createObjectURL(f))
        }

        const src = imageUrlMap.current.get(f)

        return (
          <HStack key={index} wrap="nowrap" justifyContent="space-between">
            <HStack>
              <Center position="relative" w={50} h={50} overflow="hidden">
                {src && (
                  <Image src={src} alt={f.name} fill className={styles.image} />
                )}
              </Center>

              <Text fontSize="xs" color="gray" noOfLines={1}>
                {f.name}
              </Text>
              <Text fontSize="xs" color="gray" noOfLines={1}>
                {returnFileSize(f.size)}
              </Text>
            </HStack>

            <IconButton
              size="sm"
              aria-label={`Delete ${f.name}`}
              onClick={() => onDelete(f)}
            >
              <CloseIcon />
            </IconButton>
          </HStack>
        )
      })}
    </VStack>
  )
}
