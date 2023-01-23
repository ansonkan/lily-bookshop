import type { BookFE } from 'types'
import type { ModalProps } from '@chakra-ui/react'

import { SimpleModal } from 'components'

import { BooksCreateForm } from './BooksCreateForm'

export interface BooksCreateModalProps extends Omit<ModalProps, 'children'> {
  initialBooks?: BookFE[]
}

export const BooksCreateModal = ({
  // initialBooks,
  ...modalProps
}: BooksCreateModalProps): JSX.Element => {
  return (
    <SimpleModal
      {...modalProps}
      header="Create books"
      closeOnOverlayClick={false}
    >
      <BooksCreateForm />
    </SimpleModal>
  )
}
