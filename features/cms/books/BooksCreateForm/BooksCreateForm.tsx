import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { FieldArray, Form, Formik } from 'formik'
import { useState } from 'react'

import {
  BooksCreateFormik,
  BooksCreateFormikSchema,
  initialBook,
  initialBooks,
} from './utils'
import { BookCreateFields } from './BookCreateFields'

export const BooksCreateForm = (): JSX.Element => {
  const [expandedIndex, setExpandedIndex] = useState(0)

  return (
    <Formik<BooksCreateFormik>
      initialValues={initialBooks}
      validationSchema={BooksCreateFormikSchema}
      // otherwise, when the list grows large, typing in a field will become very laggy
      validateOnChange={false}
      onSubmit={(values, { setSubmitting }) => {
        // console.log(JSON.stringify(values, null, 2))
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <Accordion
            index={expandedIndex}
            onChange={(index) => {
              typeof index === 'number' && setExpandedIndex(index)
              Array.isArray(index) && setExpandedIndex(index[0])
            }}
            // because the field is not being rendered unless `expandedIndex === index`, otherwise opening/closing will looks janky
            reduceMotion
          >
            <FieldArray name="books">
              {({ remove, push }) => {
                return (
                  <>
                    {values.books.map((book, index) => (
                      <AccordionItem key={index}>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            {book.ISBN_13 ||
                              book.ISBN_10 ||
                              book.title ||
                              `Book ${index + 1}`}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel>
                          {/* otherwise, when the list grows large, typing in a field will become very laggy */}
                          {expandedIndex === index && (
                            <BookCreateFields
                              index={index}
                              parentFieldName="books"
                            />
                          )}

                          <Button
                            leftIcon={<DeleteIcon />}
                            onClick={() => remove(index)}
                          >
                            Delete
                          </Button>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}

                    <Button
                      leftIcon={<AddIcon />}
                      onClick={() => {
                        push(initialBook)
                        setExpandedIndex(values.books.length)
                      }}
                    >
                      Add
                    </Button>
                  </>
                )
              }}
            </FieldArray>
          </Accordion>

          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}
