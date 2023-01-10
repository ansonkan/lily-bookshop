/* eslint-disable no-console */
import type { GetServerSideProps, NextPage } from 'next'

import { API } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import { Button } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { InternalLayout } from 'layouts'

const TestPage: NextPage = () => {
  const testGetBooks = () => {
    API.get('apicore', '/books?q=enthralled', {}).then((res) => {
      console.log(res)
    })
  }

  const testPostBook = () => {
    API.post('apicore', '/books', {
      body: { book: { title: 'testing title', status: 'draft' } },
    }).then((res) => {
      console.log(res)
    })
  }

  const testGetBookById = () => {
    // 63bd1136b5b4cf50045ac19d
    API.get('apicore', '/books/63bd1136b5b4cf50045ac19d', {}).then((res) => {
      console.log(res)
    })
  }

  return (
    <InternalLayout>
      <Authenticator hideSignUp>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user?.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>

      <Button onClick={testGetBooks}>Test GET /books</Button>
      <Button onClick={testGetBookById}>
        Test GET /books/63bd1136b5b4cf50045ac19d
      </Button>
      <Button onClick={testPostBook}>Test POST /books</Button>
    </InternalLayout>
  )
}

export default TestPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', ['common'])),
    },
  }
}
