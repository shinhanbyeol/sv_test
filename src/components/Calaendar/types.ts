export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export enum DayOfWeekName {
  Sunday = '일',
  Monday = '월',
  Tuesday = '화',
  Wednesday = '수',
  Thursday = '목',
  Friday = '금',
  Saturday = '토',
}

export type Day = {
  day: number;
  dayOfWeek: DayOfWeek;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type Schedule = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  color: string;
  length?: number;
  index?: number;
  overLapOrder?: number;
};
