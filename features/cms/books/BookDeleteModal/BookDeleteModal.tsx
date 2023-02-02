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

import { deleteBook } from './queries'

export interface BookDeleteModalRef {
  askToDelete: (book: BookFE) => void
}

export const BookDeleteModal = memo(
  forwardRef<BookDeleteModalRef>((props, ref) => {
    const cancelButtonRef = useRef<HTMLButtonElement>(null)
    const disclosure = useDisclosure()
    const [target, setTarget] = useState<BookFE | undefined>()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    useImperativeHandle(
      ref,
      () => {
        return {
          askToDelete(book: BookFE) {
            setTarget(book)
            disclosure.onOpen()
          },
        }
      },
      [disclosure]
    )

    const onConfirm = async () => {
      if (!target) return

      setIsLoading(true)
      try {
        await deleteBook(target)
        toast({
          title: 'The book has been deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        disclosure.onClose()
      } catch (err) {
        captureException(err)
        toast({
          title: 'Failed to delete the book',
          description: 'Something went wrong. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
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
            Are you sure you want to delete{' '}
            <Text as="b">
              {[target?.title, target?.subtitle].filter((t) => !!t).join(' - ')}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelButtonRef} onClick={disclosure.onClose}>
              No
            </Button>

            <Button
              colorScheme="red"
              ml={3}
              onClick={onConfirm}
              isLoading={isLoading}
              disabled={!target}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  })
)

BookDeleteModal.displayName = 'BookDeleteModal'
