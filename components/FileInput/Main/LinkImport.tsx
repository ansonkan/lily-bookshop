import type { NewFileValue } from '../types'

import {
  Button,
  ButtonGroup,
  HStack,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons'
import mime from 'mime-types'
import { useState } from 'react'

import { BASE_COLOR } from './constants'
import { Root } from './Root'

export interface LinkImportProps {
  canUploadMore?: boolean
  addFiles: (files: NewFileValue[]) => void
  switchToDropZone: () => void
}

export const LinkImport = ({
  canUploadMore,
  addFiles,
  switchToDropZone,
}: LinkImportProps): JSX.Element => {
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const onImport = async () => {
    setIsLoading(true)

    try {
      // const file = await fetch(link).then((r) => r.blob())
      const blob = await fetch(
        `/api/download-cors-file?link=${encodeURIComponent(link)}`
      ).then((r) => r.blob())

      addFiles([
        {
          type: 'newly-uploaded-file',
          file: new File(
            [blob],
            blob.name ||
              `new-file-${new Date().valueOf()}.${mime.extension(blob.type)}`,
            { type: blob.type }
          ),
        },
      ])
    } catch {
      toast({ title: 'Failed to import', status: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Root>
      <VStack>
        <LinkIcon boxSize={10} color={BASE_COLOR} />

        <Text align="center">Import a file from a link</Text>

        <HStack>
          <Input
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            disabled={isLoading}
          />

          <ButtonGroup>
            <Button
              onClick={onImport}
              disabled={!canUploadMore || isLoading || !link}
            >
              Import
            </Button>

            <Button onClick={switchToDropZone} disabled={isLoading}>
              Cancel
            </Button>
          </ButtonGroup>
        </HStack>
      </VStack>
    </Root>
  )
}
