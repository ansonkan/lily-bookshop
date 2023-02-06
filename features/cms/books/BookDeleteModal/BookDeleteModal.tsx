import type { BookFE } from 'types'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react'
import { captureException } from '@sentry/nextjs'
import { useTranslation } from 'next-i18next'

import { deleteBook } from './queries'

export interface BookDeleteModalRef {
  askToDelete: (book: BookFE) => void
}

export interface BookDeleteModal {
  onDeleteComplete?: (book: BookFE) => void
}

export const BookDeleteModal = memo(
  forwardRef<BookDeleteModalRef, BookDeleteModal>(
    ({ onDeleteComplete }, ref): JSX.Element => {
      const { t } = useTranslation('cms')

      const cancelButtonRef = useRef<HTMLButtonElement>(null)
      const disclosure = useDisclosure()
      const [target, setTarget] = useState<BookFE | undefined>()
      const [isLoading, setIsLoading] = useState(false)
      const toast = useToast()

      useImperativeHandle(
        ref,
        () => ({
          askToDelete(book: BookFE) {
            setTarget(book)
            disclosure.onOpen()
          },
        }),
        [disclosure]
      )

      const onConfirm = async () => {
        if (!target) return

        setIsLoading(true)
        try {
          await deleteBook(target)
          toast({
            title: t('books.delete-modal.toast.success.title'),
            status: 'success',
          })
          disclosure.onClose()

          onDeleteComplete?.(target)
        } catch (err) {
          captureException(err)
          toast({
            title: t('books.delete-modal.toast.failed.title'),
            status: 'error',
          })
        } finally {
          setIsLoading(false)
        }
      }

      return (
        <AlertDialog
          motionPreset="slideInBottom"
          isCentered
          leastDestructiveRef={cancelButtonRef}
          {...disclosure}
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>Delete?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              {t('books.delete-modal.title')}
              <Text as="b">
                {[target?.title, target?.subtitle]
                  .filter((t) => !!t)
                  .join(' - ')}
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelButtonRef} onClick={disclosure.onClose}>
                {t('books.delete-modal.no')}
              </Button>

              <Button
                colorScheme="red"
                ml={3}
                onClick={onConfirm}
                isLoading={isLoading}
                disabled={!target}
              >
                {t('books.delete-modal.yes')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }
  )
)

BookDeleteModal.displayName = 'BookDeleteModal'
