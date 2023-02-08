import type { ModalProps } from '@chakra-ui/react'

import type { NewBook } from '../BookCreateForm'

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
import { useTranslation } from 'next-i18next'

import {
  BookCreateFields,
  INITIAL_BOOK,
  NewBookSchema,
  createBook,
} from '../BookCreateForm'

export type BookCreateModalProps = Omit<
  ModalProps,
  'children' | 'isOpen' | 'onClose'
>

export interface BookCreateModalRef {
  create: (initialBook?: NewBook) => void
}

export const BookCreateModal = memo(
  forwardRef<BookCreateModalRef, BookCreateModalProps>(
    (props, ref): JSX.Element => {
      const { t } = useTranslation('cms')
      const disclosure = useDisclosure()
      const toast = useToast()

      const [initialValues, setInitialValues] = useState<NewBook>(INITIAL_BOOK)
      const [isVisible, setIsVisible] = useState(false)

      useImperativeHandle(
        ref,
        () => ({
          create(initialBook) {
            initialBook && setInitialValues(initialBook)
            // Note: to block off `Formik` just in case there is `initialValues` to set before rendering it
            setIsVisible(true)
            disclosure.onOpen()
          },
        }),
        [disclosure]
      )

      if (!isVisible) {
        // Note: to block off `Formik` just in case there is `initialValues` to set before rendering it
        return <></>
      }

      return (
        <Modal
          size="4xl"
          closeOnOverlayClick={false}
          {...props}
          {...disclosure}
          onCloseComplete={() => {
            // reset
            setInitialValues(INITIAL_BOOK)
            setIsVisible(false)
          }}
        >
          <ModalOverlay />

          <Formik<NewBook>
            initialValues={initialValues}
            validationSchema={NewBookSchema}
            // otherwise, when the list grows large, typing in a field will become very laggy
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting }) => {
              // Because of `stripUnknown` and also cast numeric strings back to number.
              const cleaned = NewBookSchema.cast(values, {
                stripUnknown: true,
              })

              try {
                await createBook(cleaned)

                toast({
                  title: t('books.add.toast.success.title'),
                  status: 'success',
                })

                disclosure.onClose()
              } catch (err) {
                captureException(err)
                toast({
                  title: t('books.add.toast.failed.title'),
                  status: 'error',
                })
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting, resetForm }) => (
              <Form>
                <ModalContent>
                  <ModalHeader>{t('breadcrumb.add-book')}</ModalHeader>
                  <ModalCloseButton />

                  <ModalBody>
                    <BookCreateFields />
                  </ModalBody>

                  <ModalFooter gap={2}>
                    <Button
                      disabled={isSubmitting}
                      onClick={() => disclosure.onClose()}
                      variant="ghost"
                    >
                      {t('common.cancel')}
                    </Button>

                    <Button
                      disabled={isSubmitting}
                      onClick={() => resetForm()}
                      variant="outline"
                    >
                      {t('common.reset')}
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                    >
                      {t('common.submit')}
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
