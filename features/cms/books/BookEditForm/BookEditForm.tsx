import type { EditedBook } from './types'

import { Button, ButtonGroup, VStack, useToast } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { captureException } from '@sentry/nextjs'
import { useTranslation } from 'next-i18next'

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
  const { t } = useTranslation('cms')
  const toast = useToast()

  return (
    <Formik<EditedBook>
      initialValues={initialValues}
      validationSchema={EditedBookSchema}
      validateOnChange={false}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          // Because of `stripUnknown` and also cast numeric strings back to number.
          const cleaned = EditedBookSchema.cast(values, {
            stripUnknown: true,
          })

          await editBook(cleaned)

          toast({
            title: t('books.edit.toast.success.title'),
            status: 'success',
          })

          onSuccess?.(cleaned)
        } catch (err) {
          captureException(err)
          toast({
            title: t('books.edit.toast.failed.title'),
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
                  {t('common.cancel')}
                </Button>
              )}

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
            </ButtonGroup>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}
