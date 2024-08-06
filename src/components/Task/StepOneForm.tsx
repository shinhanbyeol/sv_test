'use client';

import { MockImage } from '@/app/api/images/route';
import { TaskStep, useTaskStore } from '@/stores/taskGenStore';
import {
  Box,
  FormControl,
  FormLabel,
  Text,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Button,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface prosp {
  images: MockImage[];
}

const StepOneForm = ({ images }: prosp) => {
  const [imagesData] = useState<MockImage[]>(images);
  const router = useRouter();
  const { setCurrentStep, setTotalImageCount, setStepData, setImagesData } =
    useTaskStore();
  const stepData = useTaskStore(
    (state) => state.taskConfig.steps[TaskStep.step1]
  );

  useEffect(() => {
    setCurrentStep(TaskStep.step1);
    setTotalImageCount(imagesData.length);
    setImagesData(imagesData);
  }, [imagesData, setCurrentStep, setImagesData, setTotalImageCount]);

  return (
    <Stack m={4} w={'100%'}>
      <Box mb={3} bgColor={'CaptionText'} color={'white'} textAlign={'center'}>
        <Text fontSize={32}>현재 작업이 필요한 이미지 개수:</Text>
        <br />
        <Text fontSize={20}>{images.length} 개</Text>
      </Box>
      <Formik
        initialValues={{
          goalWorkloadPercent: stepData.goalWorkloadPercent,
        }}
        onSubmit={(values) => {}}
      >
        {(props) => (
          <Form>
            <Field>
              {({ field, form }: any) => (
                <FormControl>
                  <FormLabel htmlFor={'goalWorkloadPercent'} mb={12}>
                    목표 작업량 비율 설정
                    <Text color={'red'} float={'right'}>
                      {form.errors['goalWorkloadPercent']}
                    </Text>
                  </FormLabel>
                  <Slider
                    aria-label="slider-ex-5"
                    defaultValue={stepData.goalWorkloadPercent}
                    onChangeEnd={(val) => {
                      props.setFieldValue('goalWorkloadPercent', val);
                      setStepData(TaskStep.step1, {
                        goalWorkloadPercent: val,
                        goalWorkload: Math.floor((val / 100) * images.length),
                      });
                    }}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </FormControl>
              )}
            </Field>
            <Text>
              목표 작업량: {stepData.goalWorkload} / {images.length} :{' '}
              {stepData.goalWorkloadPercent}%
            </Text>
          </Form>
        )}
      </Formik>
      <Button
        mt={20}
        onClick={() => {
          router.push('/task-generation/step-2');
        }}
      >
        <Text>다음 단계로</Text>
      </Button>
    </Stack>
  );
};

export default StepOneForm;
