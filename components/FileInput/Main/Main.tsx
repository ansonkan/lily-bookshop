import type { NewFileValue } from '../types'

import { useState } from 'react'

import { DropZone } from './DropZone'
import { LinkImport } from './LinkImport'

export interface MainProps {
  name?: string
  accept: string[]
  multiple?: boolean
  canUploadMore?: boolean
  addFiles: (files: NewFileValue[]) => void
  helper?: React.ReactNode
}

export const Main = ({
  name,
  accept,
  multiple,
  canUploadMore,
  addFiles,
  helper,
}: MainProps): JSX.Element => {
  const [mode, setMode] = useState<'drop-zone' | 'link-import'>('drop-zone')

  if (mode === 'link-import') {
    return (
      <LinkImport
        canUploadMore={canUploadMore}
        addFiles={addFiles}
        switchToDropZone={() => setMode('drop-zone')}
        helper={helper}
      />
    )
  }

  return (
    <DropZone
      name={name}
      accept={accept}
      multiple={multiple}
      canUploadMore={canUploadMore}
      addFiles={addFiles}
      switchToLink={() => setMode('link-import')}
      helper={helper}
    />
  )
}
