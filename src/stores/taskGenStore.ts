import { create } from 'zustand';
import { produce } from 'immer';

export enum TaskStep {
  step1 = 0,
  step2 = 1,
  step3 = 2,
  step4 = 3,
}

type ImageData = {
  id: string;
  name: string;
  objectCount: number;
};

export type TaskConfig = {
  taskGenDate: Date;
  totalImageCount: number;
  imagesData: ImageData[];
  steps: [Step1Config, StepConfig, StepConfig, StepConfig];
};

export type StepConfig = {
  [keys: string]: any;
};

export type Step1Config = {
  goalWorkload: number;
  goalWorkloadPercent: number;
};

export type Step2Config = {
  mode: 'object' | 'task';
  count: number;
  taskDistribution: string[][];
};

export type Step3Config = {
  workers: [
    {
      id: string;
      name: string;
      taskList?: number[];
    }
  ];
};

interface TaskState {
  currentStep: TaskStep;
  taskConfig: TaskConfig;
}

interface TaskStore extends TaskState {
  setCurrentStep: (step: TaskStep) => void;
  setTaskGenDate: (date: Date) => void;
  setImagesData: (images: ImageData[]) => void;
  setTotalImageCount: (count: number) => void;
  setStepData: (step: TaskStep, data: StepConfig) => void;
}

const defulatTaskstate: TaskState = {
  currentStep: TaskStep.step1,
  taskConfig: {
    taskGenDate: new Date(),
    totalImageCount: 0,
    imagesData: [],
    steps: [
      {
        goalWorkload: 0,
        goalWorkloadPercent: 0,
      },
      {},
      {},
      {},
    ],
  },
};

export const useTaskStore = create<TaskStore>((set) => ({
  ...defulatTaskstate,
  // 현재 작업 단계를 설정
  setCurrentStep: (step: TaskStep) => set({ currentStep: step }),
  // 작업이 생선된 날짜를 설정
  setTaskGenDate: (date: Date) =>
    set(
      produce((state: TaskState) => {
        state.taskConfig.taskGenDate = date;
      })
    ),
  // 작업할 이미지 리스트 설정
  setImagesData: (images: ImageData[]) =>
    set(
      produce((state: TaskState) => {
        state.taskConfig.imagesData = images;
      })
    ),
  // 작업할 전체 이미지를 개수 설정
  setTotalImageCount: (count: number) =>
    set(
      produce((state: TaskState) => {
        state.taskConfig.totalImageCount = count;
      })
    ),
  // 작업 단계별 작업 정보 설정
  setStepData: (
    step: TaskStep,
    data: StepConfig | Step1Config | Step2Config
  ) => {
    set(
      produce((state: TaskState) => {
        if (step === TaskStep.step1) {
          state.taskConfig.steps[step] = data as Step1Config;
        }
        if (step === TaskStep.step2) {
          state.taskConfig.steps[step] = data as Step2Config;
        }
        if (step === TaskStep.step3) {
          state.taskConfig.steps[step] = data as Step3Config;
        }
        if (step === TaskStep.step4) {
          state.taskConfig.steps[step] = data;
        }
      })
    );
  },
}));
