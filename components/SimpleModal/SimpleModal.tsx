import type { ModalProps } from '@chakra-ui/react'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

export interface SimpleModalProps extends ModalProps {
  header?: string
  hideCloseButton?: boolean
}

export const SimpleModal = ({
  header,
  hideCloseButton,
  children,
  ...modalProps
}: SimpleModalProps): JSX.Element => (
  <Modal {...modalProps}>
    <ModalOverlay backdropFilter="auto" backdropBlur="sm" />

    <ModalContent>
      {!hideCloseButton && <ModalCloseButton />}
      {typeof header === 'string' && <ModalHeader>{header}</ModalHeader>}

      <ModalBody>{children}</ModalBody>
    </ModalContent>
  </Modal>
)
