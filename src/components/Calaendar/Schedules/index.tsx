import { memo, useCallback, useMemo } from 'react';
import { Schedule } from '../types';
import tw from 'tailwind-styled-components';

interface ScheDulesListProps {
  isSunday: boolean;
  schedules: Schedule[];
}

const WhiteSpace = tw.p`h-5`;

const ScheDulesList = ({ isSunday, schedules }: ScheDulesListProps) => {
  const styleSetter = useCallback((schedule: Schedule) => {
    return `z-10 h-5 text-white text-sm w-[${(schedule.length ?? 1) * 300}px] ${
      schedule.index === 0 ? 'rounded-l-lg ml-1 pl-1.5' : ''
    } ${
      schedule.length && schedule.index === schedule.length - 1
        ? 'rounded-r-lg mr-1'
        : ''
    }`;
  }, []);

  const whiteSpaceCount = useMemo(() => {
    return (
      schedules.reduce((acc, schedule, index) => {
        const overLapOrder = schedule.overLapOrder || 0;
        if (index === 0) {
          acc = overLapOrder;
        } else {
          acc = acc > overLapOrder ? overLapOrder : acc;
        }
        return acc;
      }, 0) - 1
    );
  }, [schedules]);

  const overLapOrderMax = useMemo(() => {
    return schedules.reduce((acc, schedule) => {
      acc =
        acc > (schedule.overLapOrder || 0) ? acc : schedule.overLapOrder || 0;
      return acc;
    }, 0);
  }, [schedules]);

  ``;

  return (
    <>
      <div>
        {Array.from(
          {
            length: overLapOrderMax,
          },
          (_, i) => {
            const schedule = schedules.find(
              (schedule) => schedule.overLapOrder === i + 1
            );

            return schedule ? (
              <p
                className={styleSetter(schedule)}
                key={i}
                style={{
                  backgroundColor: schedule.color,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(schedule);
                }}
              >
                {schedule?.index === 0 || isSunday ? schedule.title : <></>}
              </p>
            ) : (
              <WhiteSpace key={i} />
            );
          }
        )}
      </div>
    </>
  );
};

export default memo(ScheDulesList);

// {Array.from({ length: whiteSpaceCount }).map((_, index) => (
//   <WhiteSpace key={index} />
// ))}
// {schedules.map((schedule, index) => (
