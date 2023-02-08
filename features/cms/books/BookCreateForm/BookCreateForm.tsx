import type { BookCreateQueryResult, NewBook } from './types'

import { Button, ButtonGroup, VStack, useToast } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { captureException } from '@sentry/nextjs'
import { useTranslation } from 'next-i18next'

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

export const BookCreateForm = ({
  initialValues,
  onCancel,
  onSuccess,
  onFailed,
}: BookCreateFormProps): JSX.Element => {
  const { t } = useTranslation('cms')
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
            title: t('books.add.toast.success.title'),
            status: 'success',
          })

          onSuccess?.(result)
        } catch (err) {
          captureException(err)
          toast({
            title: t('books.add.toast.failed.title'),
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
            <BookCreateFields />

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
