import type { SimpleFieldHelperProps, SimpleFieldProps } from './types'

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
} from '@chakra-ui/react'
import { useField } from 'formik'
import { useTranslation } from 'next-i18next'

import { formatDate, parseDate } from './utils'
import { FileInput } from '../FileInput'

export const SimpleField = ({
  name,
  type,
  label,
  placeholder,
  helperText,
  format,
  parse,
  multiline,
  rows,
  options,
  min,
  max,
  step,
  precision,
  multiple,
  accept,
  ...formControlProps
}: SimpleFieldProps): JSX.Element => {
  const [field, meta, helper] = useField({ name, type })
  const isError = meta.touched && !!meta.error

  return (
    <FormControl {...formControlProps} isInvalid={isError}>
      {label && <FormLabel>{label}</FormLabel>}

      <SimpleFieldHelper
        type={type}
        placeholder={placeholder}
        field={field}
        helper={helper}
        format={format}
        parse={parse}
        multiline={multiline}
        rows={rows}
        options={options}
        min={min}
        max={max}
        step={step}
        precision={precision}
        multiple={multiple}
        accept={accept}
        label={label}
      />

      {isError ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  )
}

function cleanValue(value: unknown): string | number | undefined {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return !['undefined', 'string', 'number'].includes(typeof value)
    ? undefined
    : value
}

const proxy = <T,>(v: T): T => v

function SimpleFieldHelper<V>({
  type,
  placeholder,
  label,
  format = type === 'date' ? formatDate : proxy,
  parse = type === 'date' ? parseDate : proxy,
  multiline,
  rows,
  options,
  min,
  max,
  step,
  precision,
  multiple,
  accept = ['image/*'],
  field,
  helper,
}: SimpleFieldHelperProps<V>) {
  const { t } = useTranslation('cms')

  /**
   * TODO:
   * 1. `Menu` might be the easier workaround for multi-select (e.g. categories)
   * 2. `Textarea` + newline split might be the easier workaround for multi-free-text-value (e.g. authors)
   */
  if (options && multiple) {
    // use `Menu` (for desktop view)?
    return (
      <Menu closeOnSelect={false}>
        <MenuButton as={Button} w="full">
          {t('simple-field.menu.selected-count', {
            count: Array.isArray(field.value) ? field.value?.length : 0,
          })}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup
            title={label}
            type="checkbox"
            // Note: just relay the generic type of `Formik` for now, this component is really hard to type but save me from so many boilerplates
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            value={field.value}
            onChange={(value) =>
              helper.setValue(Array.isArray(value) ? value : [])
            }
          >
            {options.map(({ value, label }) => (
              <MenuItemOption value={value} key={value}>
                {label || value}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    )
  }

  if (type === 'file') {
    // const _value = Array.isArray(field.value)
    //   ? field.value.filter((v) => v instanceof File)
    //   : undefined

    return (
      <FileInput
        onChange={(files) => helper.setValue(files)}
        // Note: just relay the generic type of `Formik` for now, this component is really hard to type but save me from so many boilerplates
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        value={field.value}
        multiple={multiple}
        accept={accept}
      />
    )
  }

  const _value = cleanValue(parse(field.value))

  if (options) {
    return (
      <Select
        {...field}
        value={_value}
        onChange={(event) => helper.setValue(format(event.target.value))}
      >
        {options.map(({ value, label }) => (
          <option value={value} key={value}>
            {label || value}
          </option>
        ))}
      </Select>
    )
  }

  if (type === 'number') {
    return (
      <NumberInput
        min={min}
        max={max}
        step={step}
        precision={precision}
        {...field}
        value={_value}
        onChange={(str) => helper.setValue(format(str))}
        placeholder={placeholder}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    )
  }

  if (multiline) {
    return (
      <Textarea
        {...field}
        value={_value}
        placeholder={placeholder}
        onChange={(event) => helper.setValue(format(event.target.value))}
        rows={rows}
      />
    )
  }

  return (
    <Input
      type={type}
      placeholder={placeholder}
      {...field}
      // next-dev.js?3515:20 Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component.
      value={_value || ''}
      onChange={(event) => helper.setValue(format(event.target.value))}
    />
  )
}
