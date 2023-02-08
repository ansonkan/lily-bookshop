import type { FileValue, NewFileValue } from './types'

import { Button, FormHelperText, VStack } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'next-i18next'

import { isValidFileType, returnFileSize } from './utils'
import { Main } from './Main'
import { Previews } from './Previews'

export interface FileInputProps {
  name?: string
  value?: FileValue[]
  onChange?: (files: FileValue[]) => void
  multiple?: boolean
  accept: string[]
  maxSizePerFile?: number
  maxFiles?: number
}

export const FileInput = (props: FileInputProps): JSX.Element => {
  // Note: dirty workaround for now, since there is only input under the `/cms` protected route
  const { t } = useTranslation('cms')

  const [files, setFiles] = useState<FileValue[]>([])
  const [showPreviews, setShowPreviews] = useState(false)

  const {
    name,
    value,
    onChange,
    multiple,
    accept,
    maxSizePerFile = 5242880, // 5 MB
    maxFiles = 5,
  } = props

  const controlled = Object.prototype.hasOwnProperty.call(props, 'value')
  const _values = controlled ? value : files
  const displayValues = (_values || []).filter((f) =>
    f.type === 's3-object' ? f.status !== 'to-be-removed' : true
  )

  const remainingFileCount =
    (multiple ? maxFiles : 1) - (displayValues?.length || 0)

  const addFiles = (targets: NewFileValue[]) => {
    if (!remainingFileCount) return

    let validTargets = targets.filter(
      (t) => t.file.size <= maxSizePerFile && isValidFileType(t.file, accept)
    )

    validTargets = validTargets.slice(0, remainingFileCount)
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

  return (
    <VStack alignItems="stretch">
      <Main
        name={name}
        accept={accept}
        multiple={multiple}
        canUploadMore={remainingFileCount > 0}
        addFiles={addFiles}
        helper={
          <FormHelperText>
            {t('file-input.helper.size-limit', {
              size: returnFileSize(maxSizePerFile),
            })}
            ;{' '}
            {t('file-input.helper.quantity-limit', {
              count: remainingFileCount,
            })}
          </FormHelperText>
        }
      />

      {!!displayValues?.length && (
        <>
          <Previews
            files={displayValues}
            onDelete={onDelete}
            // Note: use a prop to render preview items conditionally instead to keep the `infoMap` alive
            hidden={!showPreviews}
          />

          <Button onClick={() => setShowPreviews((prev) => !prev)}>
            {t(
              showPreviews
                ? 'file-input.preview-button.hide'
                : 'file-input.preview-button.show',
              { count: displayValues.length }
            )}
          </Button>
        </>
      )}
    </VStack>
  )
}
