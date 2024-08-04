'use client';
import {
  HTMLAttributes,
  memo,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  WheelEvent,
} from 'react';
import { DayOfWeekName, Schedule } from './types';
import tw from 'tailwind-styled-components';
import { debounce, over } from 'lodash';

//sub component
import DayBox from './Day';
import Schedules from './Schedules';
import FormModal from './ScheduleForm';
import { Button, Text } from '@chakra-ui/react';

const DayOfWeekBox = tw.div`
  h-8 flex justify-center items-center
  bg-white
  text-center
`;

export type CalendarProps = HTMLAttributes<HTMLDivElement> & {
  defaultYear?: number;
  defaultMonth?: number;
  schedules?: Schedule[];
};

const Calendar = (props: CalendarProps) => {
  const locale = new Date().toLocaleDateString('en-US', {
    timeZone: 'Asia/Seoul',
  });
  const offset = new Date().getTimezoneOffset() * 60 * 1000;

  const currentMonth = useMemo(() => new Date(locale).getMonth() + 1, [locale]);
  const currentYear = useMemo(() => new Date(locale).getFullYear(), [locale]);
  const currentDay = useMemo(() => new Date(locale).getDate(), [locale]);
  const calendarRef = useRef<HTMLDivElement>(null);

  // month and year state
  const [selectedYear, setSelectedYear] = useState(
    props.defaultYear || currentYear
  );
  const [selectedMonth, setSelectedMonth] = useState(
    props.defaultMonth || currentMonth
  );

  // drag event state
  const [isDragging, setIsDragging] = useState(false);
  const [temporaryStartDate, setTemporaryStartDate] = useState<Date | null>(
    null
  );
  const [temporaryEndDate, setTemporaryEndDate] = useState<Date | null>(null);

  // 스케줄 등록창 열기
  const [openScheduleForm, setOpenScheduleForm] = useState<() => void>();

  // 선택된 달의 이전 달의 일 수
  const previousMonthDayCount = useMemo(
    () => new Date(selectedYear, selectedMonth - 1, 0).getDate(),
    [selectedMonth, selectedYear]
  );

  // 선택된 달의 일 수
  const dayCount = useMemo(
    () => new Date(selectedYear, selectedMonth, 0).getDate(),
    [selectedMonth, selectedYear]
  );

  // 선택된 달의 첫째 날의 요일
  const startDayOfWeek = useCallback(
    () => new Date(selectedYear, selectedMonth - 1, 1).getDay(),
    [selectedMonth, selectedYear]
  );

  // 월을 변경하는 함수
  const changeMonth = useCallback(
    (dircetion: number) => {
      setSelectedMonth((prev) => {
        let next = prev + dircetion;
        if (next < 1) {
          next = 12;
          setSelectedYear(selectedYear - 1);
        } else if (next > 12) {
          next = 1;
          setSelectedYear(selectedYear + 1);
        }
        return next;
      });
    },
    [selectedYear]
  );

  // debounce를 적용한 월 변경 함수
  const debounceChangeMonth = useMemo(
    () =>
      debounce(changeMonth, 50, {
        leading: true,
        trailing: false,
      }),
    [changeMonth]
  );

  // 마우스 휠 이벤트를 감지하여 월을 변경하는 함수
  const detectiveWheel = useCallback(
    (event: WheelEvent) => {
      const dircetion = event.nativeEvent.deltaY > 0 ? 1 : -1;
      debounceChangeMonth(dircetion);
    },
    [debounceChangeMonth]
  );

  // 해당 날짜에 할당된 스케줄을 반환하는 함수
  const getInvolvedSchedule = useCallback(
    (
      year: number,
      month: number,
      day: number,
      overLapOrderBySchecduleId: Map<string, number> = new Map()
    ): Schedule[] => {
      if (!props.schedules) return [];
      let overLap = 0;
      let overLapOrder = 0;
      const date = new Date(year, month - 1, day);
      const _schedules = props.schedules;
      const involvedSchedule = _schedules
        .filter(
          (schedule) =>
            date.getTime() >= schedule.startDate.getTime() &&
            date.getTime() <= schedule.endDate.getTime()
        )
        .map((schedule) => {
          overLap = overLapOrderBySchecduleId.get(schedule.id) || overLap + 1;
          overLapOrder =
            (overLapOrderBySchecduleId.get(schedule.id) || 0) < overLap
              ? overLap
              : overLapOrderBySchecduleId.get(schedule.id) || 0;

          overLapOrderBySchecduleId.set(schedule.id, overLapOrder);
          const start = schedule.startDate.getTime();
          const end = schedule.endDate.getTime();
          const length = Math.ceil((end - start) / (1000 * 60 * 60 * 24) + 1);
          const index = Math.ceil(
            (date.getTime() - start) / (1000 * 60 * 60 * 24)
          );

          return {
            ...schedule,
            index,
            length,
            overLapOrder,
          };
        });

      return involvedSchedule;
    },
    [props.schedules]
  );

  /**
   * @title isBloked
   * @description 해당 날짜가 드래그 또는 등록하려는 일정 범위에 포함되는지 확인
   */
  const isBloked = useCallback(
    (year: number, month: number, day: number) => {
      const date = new Date(year, month - 1, day);
      if (temporaryStartDate && temporaryEndDate) {
        return (
          date.getTime() >= temporaryStartDate.getTime() &&
          date.getTime() <= temporaryEndDate.getTime()
        );
      } else {
        return false;
      }
    },
    [temporaryStartDate, temporaryEndDate]
  );

  /**
   * @title daysList
   * @description 해당 월의 일 수만큼 반복하여 해당 날짜에 할당된 스케줄을 반환
   */
  const daysList = useMemo(() => {
    const overLapOrderBySchecduleId = new Map<string, number>();
    return Array.from(
      {
        length: dayCount + startDayOfWeek(),
      },
      (v, i) => {
        const day = i + 1 - startDayOfWeek();
        return {
          day: day,
          involvedSchedules: getInvolvedSchedule(
            selectedYear,
            selectedMonth,
            day,
            overLapOrderBySchecduleId
          ),
        };
      }
    );
  }, [
    dayCount,
    getInvolvedSchedule,
    selectedMonth,
    selectedYear,
    startDayOfWeek,
  ]);

  return (
    <>
      <FormModal
        initialValues={{
          title: '',
          description: '',
          startDate:
            temporaryStartDate &&
            new Date(temporaryStartDate.getTime() - offset)
              .toISOString()
              .split('T')[0],
          endDate:
            temporaryEndDate &&
            new Date(temporaryEndDate.getTime() - offset)
              .toISOString()
              .split('T')[0],
          color: '#c4c4c4',
        }}
        onCloseEvent={() => {
          setTemporaryStartDate(null);
          setTemporaryEndDate(null);
        }}
        onSubmit={(values, actions) => {
          console.log(values);
        }}
        title="일정 등록"
        confirmText="등록"
        cancelText="취소"
        wakeupFormModal={(wakeupFunction) => {
          setOpenScheduleForm(() => wakeupFunction);
        }}
      />
      <div ref={calendarRef} {...props} onWheel={detectiveWheel}>
        <div className="flex flex-col h-full bg-slate-400 border-solid border-2 border-slate-400">
          <div className="flex justify-center items-center gap-20">
            <Button type="button" onClick={() => changeMonth(-1)}>
              {`< `}
            </Button>
            <Text>{selectedMonth}</Text>
            <Text>/</Text>
            <Text>{selectedYear}</Text>
            <Button type="button" onClick={() => changeMonth(1)}>
              {` >`}
            </Button>
          </div>
          <div className="grid grid-cols-7 h-30 gap-0.5 border-b-2 border-slate-400">
            <DayOfWeekBox>{DayOfWeekName.Sunday}</DayOfWeekBox>
            <DayOfWeekBox>{DayOfWeekName.Monday}</DayOfWeekBox>
            <DayOfWeekBox>{DayOfWeekName.Tuesday}</DayOfWeekBox>
            <DayOfWeekBox>{DayOfWeekName.Wednesday}</DayOfWeekBox>
            <DayOfWeekBox>{DayOfWeekName.Thursday}</DayOfWeekBox>
            <DayOfWeekBox>{DayOfWeekName.Friday}</DayOfWeekBox>
            <DayOfWeekBox>{DayOfWeekName.Saturday}</DayOfWeekBox>
          </div>
          <div className={`grid grid-cols-7 flex-1 gap-0.5`}>
            {daysList.map((d, index) => {
              return (
                <DayBox
                  isBlocked={isBloked(selectedYear, selectedMonth, d.day)}
                  key={`${currentMonth}-${d.day}`}
                  day={d.day}
                  index={index}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  dayCount={dayCount}
                  currentMonth={currentMonth}
                  currentDay={currentDay}
                  previousMonthDayCount={previousMonthDayCount}
                  setIsDragging={setIsDragging}
                  setTemporaryStartDate={setTemporaryStartDate}
                  setTemporaryEndDate={setTemporaryEndDate}
                  isDragging={isDragging}
                  openScheduleForm={openScheduleForm ?? (() => {})}
                >
                  <Schedules
                    isSunday={index % 7 === 0}
                    schedules={d.involvedSchedules}
                  />
                </DayBox>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Calendar);