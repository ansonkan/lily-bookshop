import type { ModalProps } from '@chakra-ui/react'

import type { GoogleBook, ISBNImportFormik } from './types'
import type { NewBook } from '../BookCreateForm/types'

import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { forwardRef, memo, useImperativeHandle, useState } from 'react'
import { captureException } from '@sentry/nextjs'

import { SimpleField } from 'components'

import { INITIAL_VALUES } from './constants'
import { ISBNImportSchema } from './schemas'
import { googleBookToNewBook } from './utils'
import { mapGoogleBooks } from './queries'

export interface ISBNImportModalProps
  extends Omit<ModalProps, 'children' | 'isOpen' | 'onClose'> {
  create: (books: NewBook[]) => void
}

export interface ISBNImportModalRef {
  open: () => void
}

export const ISBNImportModal = memo(
  forwardRef<ISBNImportModalRef, ISBNImportModalProps>(
    ({ create, ...modalProps }, ref): JSX.Element => {
      const disclosure = useDisclosure()
      const toast = useToast()
      const [googleBookResult, setGoogleBookResult] = useState<
        ResultAlertProps | undefined
      >()
      const [isLoading, setIsLoading] = useState(false)

      useImperativeHandle(
        ref,
        () => ({
          open() {
            disclosure.onOpen()
          },
        }),
        [disclosure]
      )

      const doCreate = async (matches: GoogleBook[]) => {
        if (matches.length === 0) return

        setIsLoading(true)
        try {
          const newBooks = await googleBookToNewBook(matches)
          disclosure.onClose()
          create(newBooks)
        } catch (err) {
          captureException(err)
          toast({
            title: 'Failed to search from Google Book',
            description: 'Something went wrong. Please try again later.',
            status: 'error',
          })
        } finally {
          setIsLoading(false)
        }
      }

      return (
        <Modal
          size="4xl"
          closeOnOverlayClick={false}
          {...modalProps}
          {...disclosure}
          onCloseComplete={() => {
            // reset
            setGoogleBookResult(undefined)
          }}
        >
          <ModalOverlay />

          <Formik<ISBNImportFormik>
            initialValues={INITIAL_VALUES}
            validationSchema={ISBNImportSchema}
            // otherwise, when the list grows large, typing in a field will become very laggy

            onSubmit={async (values, { setSubmitting }) => {
              // Because of `stripUnknown` and also cast numeric strings back to number.
              const cleaned = ISBNImportSchema.cast(values, {
                stripUnknown: true,
              })

              try {
                const result = await mapGoogleBooks(cleaned.isbnList)

                if (result.fails.length === 0) {
                  await doCreate(result.matches)
                } else {
                  setGoogleBookResult(result)
                }
              } catch {
                toast({
                  title: 'Failed to search from Google Book',
                  description: 'Something went wrong. Please try again later.',
                  status: 'error',
                })
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting }) => {
              const _isLoading = isSubmitting || isLoading

              return (
                <Form>
                  <ModalContent>
                    <ModalHeader>ISBN import</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                      <VStack>
                        {googleBookResult && (
                          <ResultAlert {...googleBookResult} />
                        )}

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
                      </VStack>
                    </ModalBody>

                    <ModalFooter>
                      <ButtonGroup>
                        <Button
                          type="submit"
                          disabled={_isLoading}
                          isLoading={_isLoading}
                        >
                          Search
                        </Button>

                        <Button
                          disabled={
                            _isLoading || !googleBookResult?.matches.length
                          }
                          onClick={async () => {
                            if (googleBookResult?.matches.length) {
                              await doCreate(googleBookResult.matches)
                            }
                          }}
                        >
                          Create
                        </Button>
                      </ButtonGroup>
                    </ModalFooter>
                  </ModalContent>
                </Form>
              )
            }}
          </Formik>
        </Modal>
      )
    }
  )
)

type ResultAlertProps = Awaited<ReturnType<typeof mapGoogleBooks>>

function ResultAlert({ fails, matches }: ResultAlertProps): JSX.Element {
  let errMsg: string | undefined

  if (fails.length) {
    errMsg = matches.length
      ? `There are some ISBN have no matches: ${fails.join(
          ', '
        )}. If you still want to continue without them, please click "Create".`
      : 'There is no match for all of the ISBNs here.'
  }

  if (errMsg) {
    return (
      <Alert status="error">
        <AlertIcon />
        {errMsg}
      </Alert>
    )
  }

  return <></>
}
