import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import React, { createContext, useContext, useEffect } from 'react'

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
  const { isOpen, onOpen, onClose } = useContext(SearchModalContext)

  useEffect(() => {
    // this doesn't work for mobile but don't know what to fallback to
    const onKeyup = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey) return

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - https://justincypret.com/blog/adding-a-keyboard-shortcut-for-global-search
      const tagName: string | undefined = e.target?.tagName
      if (tagName && /^(?:input|textarea|select|button)$/i.test(tagName)) return

      e.preventDefault()

      onOpen()
    }

    document.addEventListener('keyup', onKeyup)

    return () => {
      document.removeEventListener('keyup', onKeyup)
    }
  }, [onOpen])

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
