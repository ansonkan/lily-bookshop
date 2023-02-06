import type { EditedBook } from './types'

import { Button, ButtonGroup, VStack, useToast } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { captureException } from '@sentry/nextjs'

import { BookEditFields } from './BookEditFields'
import { EditedBookSchema } from './schemas'
import { editBook } from './queries'

export interface BookEditFormProps {
  initialValues: EditedBook
  onCancel?: () => void
  onSuccess?: (book: EditedBook) => void
  onFailed?: (book: EditedBook) => void
}

export const BookEditForm = ({
  initialValues,
  onCancel,
  onSuccess,
  onFailed,
}: BookEditFormProps): JSX.Element => {
  const toast = useToast()

  return (
    <Formik<EditedBook>
      initialValues={initialValues}
      validationSchema={EditedBookSchema}
      validateOnBlur={true}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          // Because of `stripUnknown` and also cast numeric strings back to number.
          const cleaned = EditedBookSchema.cast(values, {
            stripUnknown: true,
          })

          await editBook(cleaned)

          toast({
            title: 'The book has been updated',
            status: 'success',
          })

          onSuccess?.(cleaned)
        } catch (err) {
          captureException(err)
          toast({
            title: 'Failed to edit the book',
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
          <VStack gap={4}>
            <BookEditFields />

            <ButtonGroup alignSelf="end">
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
          </VStack>
        </Form>
      )}
    </Formik>
  )
}
