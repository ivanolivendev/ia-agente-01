import { Box, Flex, Stack } from '@chakra-ui/react';
import { BottomSection } from './bottom-section';
import { MiddleSection } from './middle-section';
import { SidebarProvider } from './sidebar-context';


function App() {
  return (
    <SidebarProvider>
      <Flex minH='100dvh'>

        <Box flex='1'>
          <Stack h='full'>
            <MiddleSection />
            <BottomSection />
          </Stack>
        </Box>
      </Flex>
    </SidebarProvider>
  );
}

export default App;
