import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

import { BooksTabPanel } from './books'
import { MyAccountTabPanel } from './myAccount'

export const CMS = () => {
  const { t } = useTranslation()

  return (
    <Tabs isLazy>
      <Box overflow="auto">
        <TabList>
          <Tab>{t('cms.tab.books')}</Tab>
          <Tab>{t('cms.tab.blog-posts')}</Tab>
          <Tab>{t('cms.tab.my-account')}</Tab>
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
