'use client';
import {
  Step2Config,
  Step3Config,
  TaskStep,
  useTaskStore,
} from '@/stores/taskGenStore';
import {
  Box,
  List,
  ListItem,
  TableContainer,
  TableCaption,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

const StepFour = () => {
  const router = useRouter();
  const taskState = useTaskStore((state) => state.taskConfig);
  const step3Config = useTaskStore(
    (state) => state.taskConfig.steps[TaskStep.step3] as Step3Config
  );

  const taskImageDistribution = useMemo(() => {
    return taskState.steps[TaskStep.step2]
      .taskDistribution as Step2Config['taskDistribution'];
  }, [taskState.steps]);

  return (
    <Box
      width={'100%'}
      minW={'1024px'}
      height={'100%'}
      overflow={'hidden'}
      display={'flex'}
      flexDirection={'column'}
    >
      <Text fontSize="x-large" width={'100%'} textAlign={'center'}>
        Step 4
      </Text>
      <Text
        mb={4}
        fontSize={'large'}
        bgColor={'CaptionText'}
        color={'white'}
        textAlign={'center'}
      >
        작업 분배 결과 확인
      </Text>
      <Box overflow={'scroll'} flex={1}>
        <TableContainer>
          <Table size={'sm'} variant={'simple'}>
            <TableCaption />
            <Thead>
              <Tr>
                <Th>작업자 ID</Th>
                <Th>작업자 이름</Th>
                <Th>작업 번호</Th>
                <Th>할당받은 작업 이미지 id 목록</Th>
                <Th>할당받은 작업 이미지 개수</Th>
              </Tr>
            </Thead>
            <Tbody>
              {step3Config?.workers?.map((worker) => {
                // 작업자 ID
                const header1 = `${worker.id}`;
                // 작업자 이름
                const header2 = `${worker.name}`;

                // 할당받은 작업 목록
                return worker.taskList?.map((task, index) => {
                  // let objectCount = 0;
                  if (index === 0) {
                    return (
                      <>
                        <Tr>
                          <Th
                            verticalAlign={'top'}
                            rowSpan={worker.taskList?.length}
                            borderRight={'solid 0.5px #c4c4c4'}
                          >
                            {header1}
                          </Th>
                          <Th
                            verticalAlign={'top'}
                            rowSpan={worker.taskList?.length}
                            borderRight={'solid 0.5px #c4c4c4'}
                          >
                            {header2}
                          </Th>
                          <Td
                            verticalAlign={'top'}
                            borderRight={'solid 0.5px #c4c4c4'}
                          >
                            {task}
                          </Td>
                          <Td borderRight={'solid 0.5px #c4c4c4'}>
                            <List height={20} overflow={'auto'}>
                              {taskImageDistribution[task].map(
                                (imgId: string, index) => {
                                  return (
                                    <ListItem key={`img-${index}`}>
                                      {imgId}
                                    </ListItem>
                                  );
                                }
                              )}
                            </List>
                          </Td>
                          <Td>{taskImageDistribution[task].length}</Td>
                        </Tr>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <Tr>
                          <Td
                            verticalAlign={'top'}
                            borderRight={'solid 0.5px #c4c4c4'}
                          >
                            {task}
                          </Td>
                          <Td
                            verticalAlign={'top'}
                            borderRight={'solid 0.5px #c4c4c4'}
                          >
                            <List height={20} overflow={'auto'}>
                              {taskImageDistribution[task].map(
                                (imgId: string, index) => {
                                  return (
                                    <ListItem key={`img-${index}`}>
                                      {imgId}
                                    </ListItem>
                                  );
                                }
                              )}
                            </List>
                          </Td>
                          <Td>{taskImageDistribution[task].length}</Td>
                        </Tr>
                      </>
                    );
                  }
                });
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box display={'flex'} flexDirection={'row'}>
        <Button
          onClick={() => {
            router.push('/task-generation/step-3');
          }}
        >
          뒤로가기
        </Button>
      </Box>
    </Box>
  );
};

export default StepFour;
