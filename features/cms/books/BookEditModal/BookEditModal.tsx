import type { ModalProps } from '@chakra-ui/react'

import type { BookFE } from 'types'

import type { EditedBook } from './types'

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { forwardRef, memo, useImperativeHandle, useState } from 'react'
import { captureException } from '@sentry/nextjs'

import { BookEditFields } from './BookEditFields'
import { EditedBookSchema } from './schemas'
import { editBook } from './queries'

export type BookEditModalProps = Omit<
  ModalProps,
  'children' | 'isOpen' | 'onClose'
>

export interface BookEditModalRef {
  edit: (book: BookFE) => void
}

export const BookEditModal = memo(
  forwardRef<BookEditModalRef, BookEditModalProps>(
    (props, ref): JSX.Element => {
      const disclosure = useDisclosure()
      const [target, setTarget] = useState<EditedBook | undefined>()

      useImperativeHandle(
        ref,
        () => ({
          edit: (book: BookFE) => {
            setTarget({
              ...book,
              thumbnail: book.thumbnail
                ? [
                    {
                      type: 's3-object',
                      key: book.thumbnail,
                      status: 'unchanged',
                    },
                  ]
                : undefined,
            })

            disclosure.onOpen()
          },
        }),
        [disclosure]
      )

      // Note: if this needs a loading state in the future, could return a spinner overlay here

      if (!target) {
        return <></>
      }

      return (
        <Modal
          size="4xl"
          closeOnOverlayClick={false}
          {...props}
          {...disclosure}
        >
          <ModalOverlay />

          <BookEditModalContent book={target} onClose={disclosure.onClose} />
        </Modal>
      )
    }
  )
)

BookEditModal.displayName = 'BookEditModal'

interface BookEditModalContentProps {
  book: EditedBook
  onClose: () => void
}

function BookEditModalContent({ book, onClose }: BookEditModalContentProps) {
  const toast = useToast()

  return (
    <Formik<EditedBook>
      initialValues={book}
      validationSchema={EditedBookSchema}
      // otherwise, when the list grows large, typing in a field will become very laggy
      validateOnChange={false}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          // Because of `stripUnknown` and also cast numeric strings back to number.
          const cleaned = EditedBookSchema.cast(values, {
            stripUnknown: true,
          })

          await editBook(cleaned)

          toast({
            title: 'The books has been added',
            status: 'success',
          })

          onClose()
        } catch (err) {
          captureException(err)
          toast({
            title: 'Failed to add the books',
            description: 'Something went wrong. Please try again later.',
            status: 'error',
          })
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <ModalContent>
            <ModalHeader>{'Create books'}</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <BookEditFields />
            </ModalBody>

            <ModalFooter>
              <Button
                size="sm"
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Form>
      )}
    </Formik>
  )
}
