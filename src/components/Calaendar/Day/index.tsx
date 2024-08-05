import React, { memo, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import { Schedule } from '../types';

type DayBoxProps = React.PropsWithChildren<{}> & {
  isBlocked: boolean;
  day: number;
  index: number;
  selectedYear: number;
  selectedMonth: number;
  dayCount: number;
  currentMonth: number;
  currentDay: number;
  previousMonthDayCount: number;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setTemporaryStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setTemporaryEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  isDragging: boolean;
  openScheduleForm: () => void;
};
const StyledDayBox = tw.div`
  flex flex-col
  bg-white
  overflow-visible
`;

const DayBox = ({
  isBlocked,
  day,
  index,
  selectedYear,
  selectedMonth,
  dayCount,
  currentMonth,
  currentDay,
  previousMonthDayCount,
  setIsDragging,
  setTemporaryStartDate,
  setTemporaryEndDate,
  isDragging,
  openScheduleForm,
  children,
}: DayBoxProps) => {
  return (
    <>
      <StyledDayBox
        className={`select-none cursor-pointer ${isDragging && 'cursor-cell'} ${
          isBlocked ? 'bg-gray-200' : ''
        }`}
        key={index}
        onClick={() => {
          setTemporaryStartDate(new Date(selectedYear, selectedMonth - 1, day));
          setTemporaryEndDate(new Date(selectedYear, selectedMonth - 1, day));
        }}
        onMouseDown={() => {
          setIsDragging(true);
          setTemporaryStartDate(new Date(selectedYear, selectedMonth - 1, day));
          setTemporaryEndDate(null);
        }}
        onMouseOver={() => {
          if (isDragging) {
            setTemporaryEndDate(new Date(selectedYear, selectedMonth - 1, day));
          }
        }}
        onMouseUp={() => {
          setIsDragging(false);
          openScheduleForm();
        }}
      >
        <span
          className={
            currentMonth === selectedMonth && currentDay === day
              ? 'text-white bg-blue-900 rounded-full w-[26px] text-center'
              : ''
          }
        >
          {day > 0 && day <= dayCount
            ? day
            : `${selectedMonth - 1} / ${previousMonthDayCount + day}`}
        </span>
        <div>{children}</div>
      </StyledDayBox>
    </>
  );
};

export default memo(DayBox);
