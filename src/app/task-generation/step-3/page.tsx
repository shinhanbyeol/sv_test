import StepThreeForm from '@/components/Task/StepThreeForm';
import { Box, Link, Text } from '@chakra-ui/react';

async function getData() {
  return fetch('http://localhost:3000/api/users', {
    cache: 'no-cache',
  })
    .then((res) => res.json())
    .then((data) => {
      return { users: data, error: false, errorMsg: '' };
    })
    .catch((error) => {
      return { users: [], error: true, errorMsg: error.message };
    });
}

const StepThree = async () => {
  const data = await getData();

  return (
    <Box
      width={'50%'}
      minW={'800px'}
      height={'100%'}
      overflow={'hidden'}
      display={'flex'}
      flexDirection={'column'}
    >
      <Text fontSize="x-large" width={'100%'} textAlign={'center'}>
        Step 3
      </Text>
      {data.error ? (
        <Text color="red" mb={1}>
          {data.errorMsg}
          <br />
          유저 목록을 불러오는데 실패했습니다. <br />
          <Link href="/task-generation/step-3">유저 목록 다시 불러오기</Link>
        </Text>
      ) : (
        <StepThreeForm users={data.users} />
      )}
    </Box>
  );
};

export default StepThree;
