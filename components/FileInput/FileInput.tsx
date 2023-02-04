import type { FileValue, NewFileValue } from './types'

import { Button, VStack } from '@chakra-ui/react'
import { useCallback, useState } from 'react'

import { Main } from './Main'
import { Previews } from './Previews'
import { isValidFileType } from './utils'

export interface FileInputProps {
  name?: string
  value?: FileValue[]
  onChange?: (files: FileValue[]) => void
  multiple?: boolean
  accept: string[]
  maxSizePerFile?: number
}

export const FileInput = (props: FileInputProps): JSX.Element => {
  const [files, setFiles] = useState<FileValue[]>([])
  const [showPreviews, setShowPreviews] = useState(false)

  const {
    name,
    value,
    onChange,
    multiple,
    accept,
    maxSizePerFile = 5242880, // 5 MB
  } = props

  const controlled = Object.prototype.hasOwnProperty.call(props, 'value')
  const _values = controlled ? value : files
  const canUploadMore = multiple || !_values || _values.length === 0

  const addFiles = (targets: NewFileValue[]) => {
    if (!canUploadMore) return

    let validTargets = targets.filter(
      (t) => t.file.size <= maxSizePerFile && isValidFileType(t.file, accept)
    )

    if (!multiple) validTargets = validTargets.slice(0, 1)
    if (validTargets.length === 0) return

    const newFiles = [...(_values || []), ...validTargets]
    setFiles(newFiles)
    onChange?.(newFiles)
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

  const displayValues = (_values || []).filter((f) =>
    f.type === 's3-object' ? f.status !== 'to-be-removed' : true
  )

  return (
    <VStack alignItems="stretch">
      <Main
        name={name}
        accept={accept}
        multiple={multiple}
        canUploadMore={canUploadMore}
        addFiles={addFiles}
      />

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
