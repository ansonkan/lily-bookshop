import type { FileValue, NewFileValue } from './types'

import { Button, Center, Input, Text, VStack } from '@chakra-ui/react'
import { useCallback, useRef, useState } from 'react'
import { AttachmentIcon } from '@chakra-ui/icons'

import { fileListToArray, returnAcceptedFiles } from './utils'
import { Previews } from './Previews'

export interface FileInputProps {
  name?: string
  value?: FileValue[]
  onChange?: (files: FileValue[]) => void
  multiple?: boolean
  accept: string[]
}

export const FileInput = (props: FileInputProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<FileValue[]>([])
  const [inDropZone, setInDropZone] = useState(false)
  const [showPreviews, setShowPreviews] = useState(false)

  const { name, value, onChange, multiple, accept } = props

  const controlled = Object.prototype.hasOwnProperty.call(props, 'value')
  const _values = controlled ? value : files
  const canUploadMore = multiple || !_values || _values.length === 0

  const addFiles = (targets: NewFileValue[]) => {
    const newFiles = [...(_values || []), ...targets]
    setFiles(newFiles)
    onChange?.(newFiles)
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
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setInDropZone(false)
    // if (isLoading) return false

    let targets = returnAcceptedFiles(
      fileListToArray(event.dataTransfer.files),
      accept
    )

    if (!canUploadMore) return

    if (!multiple && !_values?.length) {
      // has no files, so pick the first one
      targets = targets.slice(0, 1)
    }

    addFiles(targets.map((v) => ({ type: 'newly-uploaded-file', file: v })))

    // const addedFilesLength = addTargetFiles(_files)
    // if (addedFilesLength > 0) {
    //   setShowPreviewer(true)
    //   setAutoLoad(true)
    // }
  }

  const onDelete = useCallback(
    (index: number) => {
      let newFiles = _values || []

      const f = newFiles[index]
      switch (f.type) {
        case 's3-object':
          f.status = 'to-be-removed'
          break
        default:
          newFiles = newFiles.filter((f, i) => i !== index)
      }

      setFiles(newFiles)
      onChange?.(newFiles)
    },
    [_values, onChange]
  )

  const borderColor =
    inDropZone && canUploadMore
      ? 'var(--chakra-colors-gray-300)'
      : 'var(--chakra-colors-chakra-border-color)'

  const displayValues = (_values || []).filter((f) =>
    f.type === 's3-object' ? f.status !== 'to-be-removed' : true
  )

  return (
    <VStack alignItems="stretch">
      <Center
        position="relative"
        borderColor={borderColor}
        borderWidth={1}
        borderStyle="dashed"
        borderRadius="md"
        h="40"
        onDragStart={onDragStart}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <VStack>
          <AttachmentIcon boxSize={10} color={borderColor} />
          <Text align="center">Drop the files here</Text>
          <Button
            size="sm"
            onClick={() => {
              inputRef.current && inputRef.current.click()
            }}
            disabled={!canUploadMore}
          >
            Browse files
          </Button>
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
      </Center>

      {!!displayValues?.length && (
        <>
          <Previews
            files={displayValues}
            onDelete={onDelete}
            // Note: use a prop to render preview items conditionally instead to keep the `infoMap` alive
            hidden={!showPreviews}
          />

          <Button onClick={() => setShowPreviews((prev) => !prev)}>{`${
            showPreviews ? 'Close' : 'Show'
          } previews (${displayValues.length} file${
            displayValues.length > 1 ? 's' : ''
          })`}</Button>
        </>
      )}
    </VStack>
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
