import { Box, Stack, Text } from '@chakra-ui/react';

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
        <Box overflow={'auto'}>{children}</Box>
      </Box>
    </Stack>
  );
}
