import { Box, Button } from '@chakra-ui/react'
import { useAuthenticator } from '@aws-amplify/ui-react'

import { Kvp } from '../../Kvp'

export const MyAccountTabPanel = (): JSX.Element => {
  const { user, signOut } = useAuthenticator()

  return (
    <Box display="flex" flexDirection="column" gap={[2, 4]}>
      <Kvp k="ID">{user?.username}</Kvp>
      <Kvp k="Email">{user?.attributes?.email}</Kvp>
      <Kvp k="Username">{user?.attributes?.preferred_username}</Kvp>

      <Button onClick={signOut}>Sign out</Button>
    </Box>
  )
}
