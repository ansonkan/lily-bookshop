import { Button, Center, Input, Text, VStack } from '@chakra-ui/react'
import { useCallback, useRef, useState } from 'react'
import { AttachmentIcon } from '@chakra-ui/icons'

import { fileListToArray, returnAcceptedFiles } from './utils'
import { Previews } from './Previews'

export interface FileInputProps {
  name?: string
  value?: File[]
  onChange?: (files: File[]) => void
  multiple?: boolean
  accept: string[]
}

export const FileInput = (props: FileInputProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [inDropZone, setInDropZone] = useState(false)

  const { name, value, onChange, multiple, accept } = props

  const controlled = Object.prototype.hasOwnProperty.call(props, 'value')
  const _values = controlled ? value : files
  const canUploadMore = multiple || !_values || _values.length === 0

  const addFiles = (targets: File[]) => {
    const newFiles = [...(_values || []), ...targets]
    setFiles(newFiles)
    onChange?.(newFiles)
  }

  // Copied from https://github.com/aws-amplify/amplify-ui/tree/main/packages/react/src/components/Storage/FileUploader
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.clearData()
  }
  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
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

    addFiles(targets)

    // const addedFilesLength = addTargetFiles(_files)
    // if (addedFilesLength > 0) {
    //   setShowPreviewer(true)
    //   setAutoLoad(true)
    // }
  }

  const onDelete = useCallback(
    (file: File) => {
      const newFiles = (_values || []).filter((_f) => _f !== file)
      setFiles(newFiles)
      onChange?.(newFiles)
    },
    [_values, onChange]
  )

  const borderColor =
    inDropZone && canUploadMore
      ? 'var(--chakra-colors-gray-300)'
      : 'var(--chakra-colors-chakra-border-color)'

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
              addFiles(fileListToArray(_files))
            }
          }}
          multiple={multiple}
          accept={accept?.join(',')}
        />
      </Center>

      {!!_values?.length && <Previews files={_values} onDelete={onDelete} />}
    </VStack>
  )
}
