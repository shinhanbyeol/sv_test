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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';

const StepFour = () => {
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
        fontSize={'large'}
        bgColor={'CaptionText'}
        color={'white'}
        textAlign={'center'}
      >
        작업 분배 결과 확인
      </Text>
      <Box overflow={'scroll'}>
        <TableContainer>
          <Table colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <th>작업자 ID</th>
                <th>작업자 이름</th>
                <th>작업 번호</th>
                <th>할당받은 작업 이미지 id</th>
              </Tr>
            </Thead>

            <Tbody overflow={'auto'}>
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
                          >
                            {header1}
                          </Th>
                          <Th
                            verticalAlign={'top'}
                            rowSpan={worker.taskList?.length}
                          >
                            {header2}
                          </Th>
                          <Td verticalAlign={'top'}>{task}</Td>
                          <Td>
                            <List height={20} overflow={'auto'}>
                              {taskImageDistribution[task].map(
                                (imgId: string, index) => {
                                  // const image = imageDatas.find(
                                  //   (image) => image.id === imgId
                                  // );
                                  // objectCount += image?.objectCount || 0;
                                  return (
                                    <ListItem key={`img-${index}`}>
                                      {imgId}
                                    </ListItem>
                                  );
                                }
                              )}
                            </List>
                          </Td>
                          {/* <td>{objectCount}</td> */}
                        </Tr>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <Tr>
                          <Td verticalAlign={'top'}>{task}</Td>
                          <Td verticalAlign={'top'}>
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
    </Box>
  );
};

export default StepFour;
