import type { BookCategoryDocument } from '@lily-bookshop/schemas'
import type { BookCategoryFE } from 'types'
import type { ModalProps } from '@chakra-ui/react'

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
import { BookCategoryDocumentSchema } from '@lily-bookshop/schemas'
import { captureException } from '@sentry/nextjs'
import { useTranslation } from 'next-i18next'

import { createBookCategory, editBookCategory } from './queries'
import { BookCategoryFields } from './BookCategoryFields'
import { EditedBookCategorySchema } from './schemas'
import { INITIAL_CATEGORY } from './constants'

export type BookCategoryModalProps = Omit<
  ModalProps,
  'children' | 'isOpen' | 'onClose'
>

export interface BookCategoryModalRef {
  create: () => void
  edit: (cat: BookCategoryFE) => void
}

export const BookCategoryModal = memo(
  forwardRef<BookCategoryModalRef, BookCategoryModalProps>(
    (props, ref): JSX.Element => {
      const { t } = useTranslation('cms')
      const disclosure = useDisclosure()
      const toast = useToast()
      const [mode, setMode] = useState<'add' | 'edit'>('add')
      const [isReady, setIsReady] = useState(false)
      const [initValues, setInitValues] = useState<
        BookCategoryDocument | BookCategoryFE
      >(INITIAL_CATEGORY)

      useImperativeHandle(
        ref,
        () => ({
          create() {
            setMode('add')
            setInitValues(INITIAL_CATEGORY)
            setIsReady(true)
            disclosure.onOpen()
          },
          edit(cat) {
            setMode('edit')
            setInitValues(cat)
            setIsReady(true)
            disclosure.onOpen()
          },
        }),
        [disclosure]
      )

      if (!isReady) return <></>

      return (
        <Modal
          size="4xl"
          closeOnOverlayClick={false}
          {...props}
          {...disclosure}
          onCloseComplete={() => {
            setIsReady(false)
          }}
        >
          <ModalOverlay />

          <Formik<BookCategoryDocument>
            initialValues={initValues}
            validationSchema={BookCategoryDocumentSchema}
            // otherwise, when the list grows large, typing in a field will become very laggy
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting }) => {
              // Because of `stripUnknown` and also cast numeric strings back to number.

              try {
                switch (mode) {
                  case 'add':
                    await createBookCategory(
                      BookCategoryDocumentSchema.cast(values, {
                        stripUnknown: true,
                      })
                    )
                    break
                  case 'edit':
                    await editBookCategory(
                      EditedBookCategorySchema.cast(values, {
                        stripUnknown: true,
                      })
                    )
                    break
                }

                toast({
                  title: t(`book-categories.${mode}.toast.success.title`),
                  status: 'success',
                })

                disclosure.onClose()
              } catch (err) {
                captureException(err)
                toast({
                  title: t(`book-categories.${mode}.toast.failed.title`),
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
                  <ModalHeader>
                    {t(`book-categories.${mode}.heading`)}
                  </ModalHeader>
                  <ModalCloseButton />

                  <ModalBody>
                    <BookCategoryFields />
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
