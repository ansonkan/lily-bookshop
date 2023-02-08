import type { NewFileValue } from '../types'

import { Button, ButtonGroup, Input, Text, VStack } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { AttachmentIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'

import { BASE_COLOR } from './constants'
import { Root } from './Root'
import { fileListToArray } from '../utils'

export interface DropZoneProps {
  name?: string
  accept: string[]
  multiple?: boolean
  canUploadMore?: boolean
  addFiles: (files: NewFileValue[]) => void
  switchToLink: () => void
  helper?: React.ReactNode
}

export const DropZone = ({
  name,
  accept,
  multiple,
  canUploadMore,
  addFiles,
  switchToLink,
  helper,
}: DropZoneProps): JSX.Element => {
  // Note: dirty workaround for now, since there is only input under the `/cms` protected route
  const { t } = useTranslation('cms')

  const inputRef = useRef<HTMLInputElement>(null)
  const [inDropZone, setInDropZone] = useState(false)

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setInDropZone(false)
    // if (isLoading) return false

    addFiles(
      fileListToArray(event.dataTransfer.files).map((v) => ({
        type: 'newly-uploaded-file',
        file: v,
      }))
    )

    // const addedFilesLength = addTargetFiles(_files)
    // if (addedFilesLength > 0) {
    //   setShowPreviewer(true)
    //   setAutoLoad(true)
    // }
  }
  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    // if (isLoading) return false
    setInDropZone(false)
  }
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    // if (isLoading) return false
    setInDropZone(true)
    event.dataTransfer.dropEffect = 'copy'
  }

  const borderColor =
    inDropZone && !canUploadMore ? 'var(--chakra-colors-gray-300)' : BASE_COLOR

  return (
    <Root
      borderColor={borderColor}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <VStack>
        <AttachmentIcon boxSize={10} color={borderColor} />

        <Text align="center">{t('file-input.drop-zone.title')}</Text>

        <ButtonGroup>
          <Button
            onClick={() => {
              inputRef.current && inputRef.current.click()
            }}
            disabled={!canUploadMore}
          >
            {t('file-input.drop-zone.browse-button')}
          </Button>

          <Button onClick={switchToLink} disabled={!canUploadMore}>
            {t('file-input.drop-zone.upload-link-button')}
          </Button>
        </ButtonGroup>

        {helper}
      </VStack>

      <Input
        position="absolute"
        ref={inputRef}
        opacity="0"
        zIndex={-1}
        tabIndex={-1}
        w={0}
        h={0}
        type="file"
        name={name}
        onChange={(event) => {
          if (!canUploadMore) return

          const _files = event.currentTarget.files
          if (_files !== null) {
            addFiles(
              fileListToArray(_files).map((v) => ({
                type: 'newly-uploaded-file',
                file: v,
              }))
            )
          }
        }}
        multiple={multiple}
        accept={accept?.join(',')}
      />
    </Root>
  )
}

// Copied from https://github.com/aws-amplify/amplify-ui/tree/main/packages/react/src/components/Storage/FileUploader
function onDragStart(event: React.DragEvent<HTMLDivElement>) {
  event.dataTransfer.clearData()
}

function onDragEnter(event: React.DragEvent<HTMLDivElement>) {
  event.preventDefault()
  event.stopPropagation()
}
