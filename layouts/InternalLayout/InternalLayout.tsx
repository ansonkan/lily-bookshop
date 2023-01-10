import '@aws-amplify/ui-react/styles.css'
import { Box, Center, Container, Text } from '@chakra-ui/react'

export interface InternalLayoutProps {
  children: React.ReactNode
}

export const InternalLayout = ({
  children,
}: InternalLayoutProps): JSX.Element => (
  <Box>
    <Box position="relative" h={[150, 200]} bgColor="#fbf8cc">
      <Center>
        <Text>Internal page</Text>
      </Center>
    </Box>

    <Container display="flex" flexDirection="column" gap={4} pt={4}>
      {children}
    </Container>
  </Box>
)
