import { Box, SkeletonText, Stack, StackDivider, Text } from '@chakra-ui/react';
import { Suspense } from 'react';

export default function TaskGenPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Stack height={'100%'} p={10} w={'fit-content'} margin={'0 auto'}>
      <Text fontSize="xx-large">Task Generation</Text>
      <Box
        border={'solid 1px black'}
        borderRadius={20}
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        overflow={'hidden'}
        p={4}
        justifyContent={'flex-start'}
      >
        <Box overflow={'auto'}>
          <Suspense
            fallback={
              <Stack minW={'800px'}>
                <SkeletonText />
                <SkeletonText />
                <SkeletonText />
                <SkeletonText />
              </Stack>
            }
          >
            {children}
          </Suspense>
        </Box>
      </Box>
    </Stack>
  );
}
