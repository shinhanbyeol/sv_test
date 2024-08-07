import StepOneForm from '@/components/Task/StepOneForm';
import { Box, Link, Text } from '@chakra-ui/react';

async function getData() {
  return fetch('http://localhost:3000/api/images', {
    cache: 'no-cache',
  })
    .then((res) => res.json())
    .then((data) => {
      return { images: data, error: false, errorMsg: '' };
    })
    .catch((error) => {
      return { images: [], error: true, errorMsg: error.message };
    });
}

const TaskGenerationPage = async () => {
  const data = await getData();

  return (
    <Box width={'50%'} minW={'800px'}>
      <Text fontSize="x-large" width={'100%'} textAlign={'center'}>
        Step 1
      </Text>
      {data.error ? (
        <Text color="red" mb={1}>
          {data.errorMsg}
          이미지를 불러오는데 실패했습니다.{' '}
          <Link href="/task-generation">이미지 다시 불러오기</Link>
        </Text>
      ) : (
        <Box m={4}>
          <StepOneForm images={data.images} />
        </Box>
      )}
    </Box>
  );
};

export default TaskGenerationPage;
