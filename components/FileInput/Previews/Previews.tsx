import type { FileValue } from '../types'

import { Center, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CloseIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import { Storage } from 'aws-amplify'
import { captureException } from '@sentry/nextjs'

import { getLastSplit } from 'utils'
import placeholderImageSrc from 'public/placeholder-image.png'

import { returnFileSize } from '../utils'
import styles from './styles.module.scss'

export interface PreviewsProps {
  files: FileValue[]
  onDelete: (index: number) => void
  hidden?: boolean
}

export const Previews = ({ files, onDelete, hidden }: PreviewsProps) => {
  const infoMap = useRef(new Map<File | string, Info>())

  const loadFromMap = useCallback(
    async (key: File | string, fallbackLoader: () => Info | Promise<Info>) => {
      if (!infoMap.current.has(key)) {
        infoMap.current.set(key, await fallbackLoader())
      }

      return infoMap.current.get(key) as Info
    },
    []
  )

  if (hidden) {
    return <></>
  }

  return (
    <VStack alignItems="stretch">
      {files.map((f, index) => {
        return (
          <PreviewItem
            key={f.type === 's3-object' ? f.key : index}
            value={f}
            onDelete={() => onDelete(index)}
            loadFromMap={loadFromMap}
          />
        )
      })}
    </VStack>
  )
}

interface PreviewItemProps {
  value: FileValue
  onDelete: () => void
  loadFromMap: (
    key: File | string,
    fallbackLoader: () => Info | Promise<Info>
  ) => Promise<Info>
}

interface Info {
  src?: string
  name?: string
  size?: number
}

function PreviewItem({ value, onDelete, loadFromMap }: PreviewItemProps) {
  const [{ src = placeholderImageSrc, name = '', size }, setInfo] =
    useState<Info>({})

  useEffect(() => {
    const load = async () => {
      switch (value.type) {
        case 'newly-uploaded-file':
          return setInfo(
            await loadFromMap(value.file, () => ({
              src: value.file.type.startsWith('image')
                ? URL.createObjectURL(value.file)
                : undefined,
              name: value.file.name,
              size: value.file.size,
            }))
          )

        // case 'newly-uploaded-url':
        //   return setInfo(
        //     await loadFromMap(value.url, () => {
        //       // TODO: fetch the file here
        //       return { src: value.url }
        //     })
        //   )
        case 's3-object':
          return setInfo(
            await loadFromMap(value.key, async () => {
              try {
                const image = await Storage.get(value.key, {
                  level: 'public',
                  download: true,
                })

                return {
                  src:
                    image.Body instanceof Blob
                      ? URL.createObjectURL(image.Body)
                      : undefined,
                  name: decodeURIComponent(getLastSplit(value.key, '/')),
                  size: image.ContentLength,
                }
              } catch (err) {
                captureException(err)
                return {}
              }
            })
          )
      }
    }

    load()
  }, [loadFromMap, value])

  return (
    <HStack wrap="nowrap" justifyContent="space-between">
      <HStack>
        <Center position="relative" w={50} h={50} overflow="hidden">
          {src && <Image src={src} alt={name} fill className={styles.image} />}
        </Center>

        {name && (
          <Text fontSize="xs" color="gray" noOfLines={1}>
            {name}
          </Text>
        )}

        {size !== undefined && (
          <Text fontSize="xs" color="gray" noOfLines={1}>
            {returnFileSize(size)}
          </Text>
        )}
      </HStack>

      <IconButton
        aria-label={`Delete ${name}`}
        onClick={onDelete}
        icon={<CloseIcon />}
      />
    </HStack>
  )
}
