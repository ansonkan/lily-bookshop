import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import React, { createContext, useContext } from 'react'

import { BookSearchForm } from '../BookSearchForm'

export const SearchModalContext = createContext({
  isOpen: false,
  onOpen: () => {
    //
  },
  onClose: () => {
    //
  },
  onToggle: () => {
    //
  },
})

export interface SearchModalProviderProps {
  children?: React.ReactNode
}

export const SearchModalProvider = ({ children }: SearchModalProviderProps) => {
  const disclosure = useDisclosure()

  return (
    <SearchModalContext.Provider value={disclosure}>
      {children}
    </SearchModalContext.Provider>
  )
}

export const SearchModal = (): JSX.Element => {
  const { isOpen, onClose } = useContext(SearchModalContext)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="auto" backdropBlur="sm" />

      <ModalContent>
        <ModalBody>
          <BookSearchForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
