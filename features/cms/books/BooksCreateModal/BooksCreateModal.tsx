import type { ModalProps } from '@chakra-ui/react'

import type { BookFE } from 'types'

import type { BooksCreateFormik } from './types'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { FieldArray, Form, Formik } from 'formik'
import { captureException } from '@sentry/nextjs'
import { mutate } from 'swr'
import { useState } from 'react'

import { INITIAL_BOOK, INITIAL_BOOKS } from './constants'
import { BookCreateFields } from './BookCreateFields'
import { BooksCreateFormikSchema } from './utils'
import { createBooks } from './queries'

export interface BooksCreateModalProps extends Omit<ModalProps, 'children'> {
  initialBooks?: BookFE[]
}

export const BooksCreateModal = ({
  // initialBooks,
  ...modalProps
}: BooksCreateModalProps): JSX.Element => {
  const [expandedIndex, setExpandedIndex] = useState(0)
  const toast = useToast()

  return (
    <Modal size="4xl" closeOnOverlayClick={false} {...modalProps}>
      <ModalOverlay backdropFilter="auto" backdropBlur="sm" />

      <Formik<BooksCreateFormik>
        initialValues={INITIAL_BOOKS}
        validationSchema={BooksCreateFormikSchema}
        // otherwise, when the list grows large, typing in a field will become very laggy
        validateOnChange={false}
        onSubmit={(values, { setSubmitting }) => {
          // Because of `stripUnknown` and also cast numeric strings back to number.
          const cleaned = BooksCreateFormikSchema.cast(values, {
            stripUnknown: true,
          })

          createBooks(cleaned)
            .then(() => {
              setSubmitting(false)

              mutate(
                (key) =>
                  Array.isArray(key) &&
                  typeof key[1] === 'string' &&
                  key[1].startsWith('/books')
              )

              toast({
                title: 'New books added',
                // description: "We've created your account for you.",
                status: 'success',
                duration: 3000,
                isClosable: true,
              })

              modalProps.onClose()
            })
            .catch((err) => {
              captureException(err)
              toast({
                title: 'Failed to add new books',
                description: 'Something went wrong. Please try again later.',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            })
            .finally(() => {
              setSubmitting(false)
            })
        }}
      >
        {({ isSubmitting, values, errors, touched }) => (
          <Form>
            <ModalContent>
              <ModalHeader>{'Create books'}</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <Accordion
                  index={expandedIndex}
                  defaultIndex={[0]}
                  onChange={(index) => {
                    typeof index === 'number' && setExpandedIndex(index)
                    Array.isArray(index) && setExpandedIndex(index[0])
                  }}
                  // because the field is not being rendered unless `expandedIndex === index`, otherwise opening/closing will looks janky
                  reduceMotion
                >
                  <FieldArray name="books">
                    {({ remove, push }) => {
                      return (
                        <>
                          {values.books.map((book, index) => {
                            return (
                              <FieldBook
                                key={index}
                                book={book}
                                index={index}
                                expandedIndex={expandedIndex}
                                removeSelf={() => remove(index)}
                                showError={
                                  !!touched.books?.[index] &&
                                  !!errors.books?.[index]
                                }
                              />
                            )
                          })}

                          <Button
                            mt={4}
                            size="sm"
                            leftIcon={<AddIcon />}
                            variant="ghost"
                            w="full"
                            onClick={() => {
                              push(INITIAL_BOOK)
                              setExpandedIndex(values.books.length)
                            }}
                          >
                            Create new draft
                          </Button>
                        </>
                      )
                    }}
                  </FieldArray>
                </Accordion>
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

interface FieldBookProps {
  book: Partial<BooksCreateFormik['books'][number]>
  index: number
  expandedIndex: number
  showError?: boolean
  removeSelf: () => void
}

function FieldBook({
  book,
  index,
  expandedIndex,
  showError,
  removeSelf,
}: FieldBookProps): JSX.Element {
  return (
    <AccordionItem>
      <AccordionButton color={showError ? 'red.500' : undefined}>
        <Text flex="1" textAlign="left" fontWeight="bold">
          {book.title || book.ISBN_13 || book.ISBN_10 || `Book ${index + 1}`}
        </Text>

        <AccordionIcon />
      </AccordionButton>

      <AccordionPanel>
        {/* otherwise, when the list grows large, typing in a field will become very laggy */}
        {expandedIndex === index && (
          <BookCreateFields
            index={index}
            parentFieldName="books"
            extra={
              <Button
                size="sm"
                w="full"
                variant="ghost"
                leftIcon={<CloseIcon />}
                onClick={removeSelf}
              >
                Delete draft
              </Button>
            }
          />
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}
