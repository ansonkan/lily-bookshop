import { Center, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import { memo } from 'react'

import { returnFileSize } from '../utils'
import styles from './styles.module.scss'

export interface PreviewsProps {
  files: File[]
  onDelete: (file: File) => void
}

export const Previews = memo(({ files, onDelete }: PreviewsProps) => {
  return (
    <VStack alignItems="stretch">
      {files?.map((f, index) => {
        const src = f.type.startsWith('image')
          ? URL.createObjectURL(f)
          : undefined

        return (
          <HStack key={index} wrap="nowrap" justifyContent="space-between">
            <HStack>
              <Center w={50} h={50} overflow="hidden" position="relative">
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
})

Previews.displayName = 'Previews'
