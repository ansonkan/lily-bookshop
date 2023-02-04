import type { ModalProps } from '@chakra-ui/react'

import type { GoogleBookSearchResult, ISBNImportFormik } from './types'
import type { NewBook } from '../BooksCreateModal/types'

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
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { forwardRef, memo, useImperativeHandle } from 'react'

import { SimpleField } from 'components'

import { INITIAL_VALUES } from './constants'
import { ISBNImportSchema } from './schemas'

export interface ISBNImportModalProps
  extends Omit<ModalProps, 'children' | 'isOpen' | 'onClose'> {
  create: (books: NewBook[]) => void
}

export interface ISBNImportModalRef {
  open: () => void
}

export const ISBNImportModal = memo(
  forwardRef<ISBNImportModalRef, ISBNImportModalProps>(
    (
      {
        // create,
        ...modalProps
      },
      ref
    ): JSX.Element => {
      const disclosure = useDisclosure()

      useImperativeHandle(
        ref,
        () => ({
          open() {
            disclosure.onOpen()
          },
        }),
        [disclosure]
      )

      return (
        <Modal
          size="4xl"
          closeOnOverlayClick={false}
          {...modalProps}
          {...disclosure}
        >
          <ModalOverlay />

          <Formik<ISBNImportFormik>
            initialValues={INITIAL_VALUES}
            validationSchema={ISBNImportSchema}
            // otherwise, when the list grows large, typing in a field will become very laggy
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting }) => {
              // Because of `stripUnknown` and also cast numeric strings back to number.
              const cleaned = ISBNImportSchema.cast(values, {
                stripUnknown: true,
              })

              const results = await Promise.allSettled<
                Promise<GoogleBookSearchResult>
              >(
                cleaned.isbnList.map((isbn) =>
                  fetch(
                    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
                  ).then((r) => r.json())
                )
              )

              // const fails = results.filter(
              //   (r) =>
              //     r.status === 'rejected' ||
              //     (r.status === 'fulfilled' && r.value.totalItems === 0)
              // )

              // const googleBooks = results.reduce(() => , {})

              // TODO: continue...
              // eslint-disable-next-line no-console
              console.log(results)

              setSubmitting(false)

              // createBooks(cleaned)
              //   .then(() => {
              //     setSubmitting(false)

              //     toast({
              //       title: 'The books has been added',
              //       status: 'success',
              //     })

              //     modalProps.onClose()
              //   })
              //   .catch((err) => {
              //     captureException(err)
              //     toast({
              //       title: 'Failed to add the books',
              //       description:
              //         'Something went wrong. Please try again later.',
              //       status: 'error',
              //     })
              //   })
              //   .finally(() => {
              //     setSubmitting(false)
              //   })
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <ModalContent>
                  <ModalHeader>ISBN import</ModalHeader>
                  <ModalCloseButton />

                  <ModalBody>
                    <SimpleField
                      label="ISBN list"
                      name="isbnList"
                      type="text"
                      placeholder="0743279603"
                      multiline
                      rows={10}
                      format={(value) => `${value}`.split('\n')}
                      parse={(value: string[]) => value.join('\n')}
                    />
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
        </Modal>
      )
    }
  )
)
