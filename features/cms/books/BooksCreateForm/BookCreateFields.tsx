import { SimpleField } from 'components'

export interface BookCreateFieldsProps {
  parentFieldName?: string
  index?: number
}

export const BookCreateFields = ({
  index,
  parentFieldName,
}: BookCreateFieldsProps) => {
  const namePrefix =
    typeof index === 'number' && parentFieldName
      ? `${parentFieldName}[${index}].`
      : ''

  return (
    <>
      <SimpleField
        label="Status"
        name={`${namePrefix}status`}
        options={[
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'archived', label: 'Archived' },
        ]}
      />

      <SimpleField label="Title" name={`${namePrefix}title`} type="text" />
      <SimpleField
        label="Subtitle"
        name={`${namePrefix}subtitle`}
        type="text"
      />

      <SimpleField
        label="Authors"
        name={`${namePrefix}authors`}
        type="text"
        multiline
        format={(value) => `${value}`.split('\n')}
        parse={(value) => (Array.isArray(value) ? value.join('\n') : '')}
      />

      <SimpleField
        label="Quantity"
        name={`${namePrefix}quantity`}
        type="number"
        min={0}
      />
    </>
  )
}
