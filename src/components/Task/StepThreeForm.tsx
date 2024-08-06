'use client';

import { useCallback, useState } from 'react';
import { MockUser } from '@/app/api/users/route';
import { Stack, Box, Text, ListItem, List, Button } from '@chakra-ui/react';
import { Step2Config, TaskStep, useTaskStore } from '@/stores/taskGenStore';
import _ from 'lodash';

interface StepThreeFormProps {
  users: MockUser[];
}

const StepThreeForm = ({ users }: StepThreeFormProps) => {
  const [usersData] = useState<MockUser[]>(users);
  const [selectedUser, setSelectedUser] = useState<MockUser[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const step2Config = useTaskStore(
    (state) => state.taskConfig.steps[TaskStep.step2] as Step2Config
  );
  const { setStepData } = useTaskStore();

  const handleTogleUser = useCallback(
    (user: MockUser) => {
      if (!user) return;
      const isAlreadySelected = selectedUser?.find((u) => u.id === user.id);

      if (!isAlreadySelected) {
        setSelectedUser((prev) => {
          if (!prev) return [user];
          return [...prev, user];
        });
      } else {
        setSelectedUser((prev) => {
          if (!prev) return null;
          return prev.filter((u) => u.id !== user.id);
        });
      }
    },
    [selectedUser]
  );

  const handleToAssignTask = useCallback(() => {
    if (!selectedUser) return;

    const workers: {
      id: string;
      name: string;
      taskList?: number[];
    }[] = selectedUser.map((user) => ({
      id: user.id,
      name: user.name,
      taskList: [],
    }));

    const _taskDistribution: string[][] = _.cloneDeep(
      step2Config.taskDistribution
    );

    let idx = 0;
    let maxIdx = workers.length - 1;
    _taskDistribution.forEach((taskList, index) => {
      if (idx > maxIdx) idx = 0;
      workers[idx].taskList?.push(index);
      idx++;
    });

    setStepData(TaskStep.step3, {
      workers,
    });
  }, [step2Config, selectedUser]);

  return (
    <Stack direction={'row'} flex={1} overflow={'auto'}>
      <Box flex={1} overflow={'auto'} display={'flex'} flexDirection={'column'}>
        <Text fontSize="large" mb={3}>
          작업자 목록: 작업할 유저를 선택해주세요
        </Text>
        <List overflow={'auto'} flex={1} h={'90%'} className="select-none">
          {usersData.map((user) => (
            <ListItem
              width={'100%'}
              bgColor={
                selectedUser?.find((u) => u.id === user.id)
                  ? 'gray.200'
                  : 'white'
              }
              key={user.id}
              cursor={'pointer'}
              onClick={() => handleTogleUser(user)}
              onMouseDown={(e) => {
                setIsDragging(true);
              }}
              onMouseUp={(e) => {
                setIsDragging(false);
              }}
              onMouseOver={(e) => {
                if (isDragging) {
                  handleTogleUser(user);
                }
              }}
            >
              <Text draggable={false}>
                {user.name} / {user.email}
              </Text>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box flex={1} display={'flex'} flexDirection={'column'}>
        <Text fontSize="large" mb={3}>
          선택된 유저
        </Text>
        <List overflow={'auto'} flex={1} className="select-none">
          {selectedUser?.map((user) => (
            <ListItem
              width={'100%'}
              key={user.id}
              cursor={'pointer'}
              onClick={() => handleTogleUser(user)}
            >
              <Text draggable={false}>
                {user.name} / {user.email}
              </Text>
            </ListItem>
          ))}
        </List>
        <Button onClick={() => handleToAssignTask()}>작업 할당 하기</Button>
      </Box>
    </Stack>
  );
};

export default StepThreeForm;
