import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

import { BooksTabPanel, MyAccountTabPanel } from './components'

export const CMS = () => {
  return (
    <Tabs isLazy>
      <Box overflow="auto">
        <TabList>
          <Tab>Books</Tab>
          <Tab>Articles</Tab>
          <Tab>My Account</Tab>
        </TabList>
      </Box>

      <TabPanels>
        <TabPanel>
          <BooksTabPanel />
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <MyAccountTabPanel />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
