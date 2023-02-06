import { ButtonGroup } from '@chakra-ui/react'

import type { BookCreateQueryResult, NewBook } from './types'

import { Button, useToast } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { captureException } from '@sentry/nextjs'
import { memo } from 'react'

import { BookCreateFields } from './BookCreateFields'
import { INITIAL_BOOK } from './constants'
import { NewBookSchema } from './schemas'
import { createBook } from './queries'

export interface BookCreateFormProps {
  initialValues?: NewBook
  onCancel?: () => void
  onSuccess?: (book: BookCreateQueryResult) => void
  onFailed?: (book: NewBook) => void
}

export const BookCreateForm = memo(
  ({
    initialValues,
    onCancel,
    onSuccess,
    onFailed,
  }: BookCreateFormProps): JSX.Element => {
    const toast = useToast()

    return (
      <Formik<NewBook>
        initialValues={{ ...INITIAL_BOOK, ...initialValues }}
        validationSchema={NewBookSchema}
        validateOnBlur={true}
        onSubmit={async (values, { setSubmitting }) => {
          // Because of `stripUnknown` and also cast numeric strings back to number.
          const cleaned = NewBookSchema.cast(values, {
            stripUnknown: true,
          })

          try {
            const result = await createBook(cleaned)

            toast({
              title: 'The books has been added',
              status: 'success',
            })

            onSuccess?.(result)
          } catch (err) {
            captureException(err)
            toast({
              title: 'Failed to add the books',
              status: 'error',
            })
            onFailed?.(values)
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, resetForm }) => (
          <Form>
            <BookCreateFields />

            <ButtonGroup>
              {onCancel && (
                <Button
                  disabled={isSubmitting}
                  onClick={() => onCancel()}
                  variant="ghost"
                >
                  Cancel
                </Button>
              )}

              <Button
                disabled={isSubmitting}
                onClick={() => resetForm()}
                variant="outline"
              >
                Reset
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    )
  }
)

BookCreateForm.displayName = 'BookCreateForm'
