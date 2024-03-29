import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { SearchIcon } from '@chakra-ui/icons'

export interface AutocompleteProps extends Omit<InputProps, 'onChange'> {
  options: string[]
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  searchButtonLabel: string
  isLoading?: boolean
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options,
      onChange,
      onSearch,
      searchButtonLabel,
      isLoading,
      ...inputProps
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement>(null)

    const [internalValue, setInternalValue] = useState('')
    const [opened, setOpened] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState<undefined | number>()

    const reset = () => {
      setOpened(false)
      setFocusedIndex(undefined)
    }

    useEffect(() => {
      if (!rootRef.current) return

      rootRef.current.addEventListener('focusin', () => setOpened(true))
      rootRef.current.addEventListener('focusout', () => {
        // give a small window for user's click to go through before the options disappear
        setTimeout(reset, 10)
      })
    }, [])

    const _onChange = (v: string) => {
      setInternalValue(v)
      onChange?.(v)
    }

    const _value = (inputProps.value || '') + '' || internalValue

    return (
      <InputGroup ref={rootRef} size={inputProps.size}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon />
        </InputLeftElement>

        <Input
          autoComplete="off"
          pr="20"
          onKeyDown={(event) => {
            switch (event.key) {
              case 'ArrowUp':
                event.preventDefault()
                setFocusedIndex((prev) =>
                  prev === undefined ? undefined : Math.max(prev - 1, 0)
                )
                break
              case 'ArrowDown':
                event.preventDefault()
                !opened && setOpened(true)
                setFocusedIndex((prev) =>
                  Math.min((prev ?? -1) + 1, options.length - 1)
                )
                break
              case 'Enter':
                if (typeof focusedIndex === 'number') {
                  _onChange(options[focusedIndex])
                  onSearch?.(_value)
                } else if (_value) {
                  onSearch?.(_value)
                }
                reset()
                break
            }
          }}
          onChange={(event) => {
            _onChange(event.target.value)
            !opened && setOpened(true)
          }}
          {...inputProps}
          ref={ref}
        />

        <InputRightElement width="5rem">
          <Button
            onClick={() => {
              onSearch?.(_value)
              reset()
            }}
            disabled={!_value}
            size="sm"
            isLoading={isLoading}
          >
            {searchButtonLabel}
          </Button>
        </InputRightElement>

        {opened && options.length && (
          <Box
            position="absolute"
            bottom={0}
            width="full"
            transform="translateY(calc(100% + var(--chakra-space-2)))"
            borderWidth={1}
            borderStyle="solid"
            borderColor="var(--chakra-colors-chakra-border-color)"
            py={2}
            borderRadius="md"
            boxShadow="sm"
            bg="white"
            zIndex="popover"
          >
            {options.map((s, index) => (
              <Box
                key={s + index}
                py="1.5"
                px="3"
                cursor="pointer"
                onMouseMove={() =>
                  typeof focusedIndex === 'number' && setFocusedIndex(undefined)
                }
                onClick={() => {
                  _onChange(s)
                  onSearch?.(_value)
                  reset()
                }}
                background={focusedIndex === index ? 'gray.100' : undefined}
                _hover={{ backgroundColor: 'gray.100' }}
              >
                {s}
              </Box>
            ))}
          </Box>
        )}
      </InputGroup>
    )
  }
)

Autocomplete.displayName = 'Autocomplete'
