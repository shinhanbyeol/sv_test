'use client';

import StepTwoFrom from '@/components/Task/StepTwoFrom';
import { TaskStep, useTaskStore } from '@/stores/taskGenStore';
import { Box, Text } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';

const StepTwo = () => {
  const stepOneConfig = useTaskStore(
    (state) => state.taskConfig.steps[TaskStep.step1]
  );

  return (
    <Box width={'50%'} minW={'800px'}>
      <Text fontSize="x-large" width={'100%'} textAlign={'center'}>
        Step 2
      </Text>
      {stepOneConfig.goalWorkload < 1 ? (
        <Text color="red" mb={1}>
          할당된 이미지가 없습니다.{' '}
          <Link href="/task-generation">Step 1 으로 돌아가기</Link>
        </Text>
      ) : (
        <StepTwoFrom />
      )}
    </Box>
  );
};

export default StepTwo;
