import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TaskStep, useTaskStore } from '@/stores/taskGenStore';
import { Button, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { Form, Formik } from 'formik';

const StepTwoFrom = () => {
  const stepOneConfig = useTaskStore(
    (state) => state.taskConfig.steps[TaskStep.step1]
  );
  const stepTwoConfig = useTaskStore(
    (state) => state.taskConfig.steps[TaskStep.step2]
  );
  const imagesData = useTaskStore((state) => state.taskConfig.imagesData);
  const { setCurrentStep, setStepData } = useTaskStore();
  const router = useRouter();

  const allObjectCount = useMemo(() => {
    return imagesData
      .slice(0, stepOneConfig.goalWorkload)
      .reduce((acc, cur) => {
        return acc + cur.objectCount;
      }, 0);
  }, [imagesData, stepOneConfig.goalWorkload]);

  const avgObjectCount = useMemo(
    () => allObjectCount / stepOneConfig.goalWorkload,
    [allObjectCount, stepOneConfig]
  );

  /**
   * @description 작업량 계산 함수
   */
  const handleCaclulate = useCallback(
    (value: number, mode: 'object' | 'task') => {
      const taskDistribution: string[][] = [];
      switch (mode) {
        case 'object':
          let taskForObjetStack = 0;
          let taskForImageStack: string[] = [];
          imagesData.forEach((image) => {
            taskForObjetStack += image.objectCount;
            taskForImageStack.push(image.id);
            if (taskForObjetStack >= value) {
              taskDistribution.push(taskForImageStack);
              taskForObjetStack = 0;
              taskForImageStack = [];
            }
          });
          break;
        case 'task':
          const taskForImage = Math.floor(imagesData.length / value);
          const mod = imagesData.length % value;
          for (let i = 0; i < value; i++) {
            taskDistribution.push(
              imagesData
                .slice(i * taskForImage, (i + 1) * taskForImage)
                .map((image) => image.id)
            );
          }
          if (mod > 0) {
            taskDistribution.push(
              imagesData.slice(value * taskForImage).map((image) => image.id)
            );
          }
          break;
        default:
          break;
      }
      return taskDistribution;
    },
    [imagesData]
  );

  useEffect(() => {
    setCurrentStep(TaskStep.step2);
  }, [setCurrentStep]);

  return (
    <>
      <Stack m={4}>
        <Text
          fontSize={20}
          bgColor={'CaptionText'}
          color={'white'}
          textAlign={'center'}
        >
          할당된 이미지: {stepOneConfig.goalWorkload}개를 분배하기위한 작업
          설정을 하십시오,
          <br />
          전체 object 수: {allObjectCount} / 이미지 별 평균 object 개수:{' '}
          {Math.ceil(avgObjectCount)}
        </Text>
        <Formik
          initialValues={{
            count: stepTwoConfig.count,
            mode: stepTwoConfig.mode,
          }}
          onSubmit={(values, actions) => {
            const mode = values.mode as 'object' | 'task';
            const count = values.count;
            actions.setSubmitting(true);
            const taskDistribution = handleCaclulate(count, mode);
            setStepData(TaskStep.step2, {
              mode,
              count,
              taskDistribution: taskDistribution,
            });
            router.push('/task-generation/step-3');
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <Text fontSize={16} fontWeight={'bold'} textAlign={'center'}>
                작업 생성 모드:{' '}
                {props.values.mode === 'object'
                  ? 'Object base mode'
                  : 'Tasks base mode'}
              </Text>
              <Stack
                mt={20}
                direction={'row'}
                justifyContent={'center'}
                h="100%"
              >
                <Button
                  border={
                    props.values.mode === 'object' ? 'solid 1px black' : 'none'
                  }
                  bgColor={props.values.mode === 'object' ? '' : 'transparent'}
                  type="button"
                  w={300}
                  h={300}
                  flexDir={'column'}
                  onClick={() => {
                    props.setFieldValue('mode', 'object');
                  }}
                >
                  <Text fontSize={20}>Object base mode</Text>
                  <Textarea
                    mt={4}
                    w={'100%'}
                    overflowWrap={'break-word'}
                    resize={'none'}
                    value={
                      '이미지에 포함된 object의 개수를 기반으로 작업을 생성합니다'
                    }
                  ></Textarea>
                  <Input
                    mt={4}
                    bgColor={'white'}
                    type="number"
                    id="count"
                    name="count"
                    placeholder="작업당 처리할 이미지의 object 개수"
                    defaultValue={props.values.count}
                    value={
                      props.values.mode !== 'object' ? '' : props.values.count
                    }
                    disabled={props.values.mode !== 'object'}
                    onChange={props.handleChange}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </Button>
                <Button
                  border={
                    props.values.mode === 'task' ? 'solid 1px black' : 'none'
                  }
                  bgColor={props.values.mode === 'task' ? '' : 'transparent'}
                  type="button"
                  w={300}
                  h={300}
                  flexDir={'column'}
                  justifyContent={'center'}
                  onClick={() => {
                    props.setFieldValue('mode', 'task');
                  }}
                >
                  <Text fontSize={20}>Tasks base mode</Text>
                  <Textarea
                    mt={4}
                    w={'100%'}
                    overflowWrap={'break-word'}
                    resize={'none'}
                    value={
                      'object의 개수와 상관없이 작업당 처리할 이미지의 개수'
                    }
                  />
                  <Input
                    mt={4}
                    bgColor={'white'}
                    type="number"
                    placeholder="작업당 처리할 이미지의 개수"
                    id="count"
                    name="count"
                    defaultValue={props.values.count}
                    value={
                      props.values.mode !== 'task' ? '' : props.values.count
                    }
                    disabled={props.values.mode !== 'task'}
                    onChange={props.handleChange}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </Button>
              </Stack>
              <Stack mt={20} direction={'row'} pl={10} pr={10}>
                <Button
                  type="button"
                  flex={1}
                  variant={'ghost'}
                  onClick={() => {
                    router.push('/task-generation');
                  }}
                >
                  <Text>뒤로</Text>
                </Button>
                <Button
                  type="submit"
                  flex={1}
                  mt={0}
                  isLoading={props.isSubmitting}
                >
                  <Text>다음 단계로</Text>
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </>
  );
};

export default StepTwoFrom;
