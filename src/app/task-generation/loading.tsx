import { SkeletonText, Text, Stack } from '@chakra-ui/react';

export default function Loading() {
  return (
    <>
      <Stack minW={'800px'}>
        <Text fontSize="xx-large">Task Generation Loading...</Text>
        <SkeletonText />
        <SkeletonText />
        <SkeletonText />
        <SkeletonText />
      </Stack>
    </>
  );
}
