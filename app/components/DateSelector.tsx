import { useDrag } from "@use-gesture/react";
import { useSpring, animated, config } from "@react-spring/web";
import { clamp } from "@/utils/clamp";
import {
  addDays,
  addMonths,
  addWeeks,
  isSameDay,
  lastDayOfMonth,
  startOfMonth,
} from "date-fns";
import { forwardRef, useCallback } from "react";
import { Swiper, SwiperItem } from "@/components/ui/Swiper";
import { DailyTodoList } from "./todo/DailyTodoList";
import { cx } from "@/utils/cx";
import { useCurrentDateStore } from "@/stores/current-date";
import { useShallow } from "zustand/shallow";

const CELL_HEIGHT = 48;
const MAX_HEIGHT = CELL_HEIGHT * 6;

type DateSelectorProps = {
  className?: string;
  height: number;
  width: number;
};
export const DateSelector = forwardRef<HTMLDivElement, DateSelectorProps>(
  function (props, ref) {
    const { className, width, height } = props;
    const { currentDate, changeCurrentDate } = useCurrentDateStore(
      useShallow((state) => ({ ...state }))
    );
    const daysInCalendar = getCalendarDays(currentDate);
    const thisWeek = getWeek(daysInCalendar, currentDate);

    const [{ h }, api] = useSpring(() => ({
      h: CELL_HEIGHT,
      config: { tension: 10, friction: 26, mass: 0.3 },
    }));
    const todoListHeight = h.to((v) => Math.max(height - v, 0));
    const progress = h.to((v) =>
      clamp((v - CELL_HEIGHT) / (MAX_HEIGHT - CELL_HEIGHT), 0, 1)
    );
    const transitionY = progress.to((v) => {
      const startY = -thisWeek * CELL_HEIGHT;
      const y = startY * (1 - v);
      return y;
    });
    const open = ({ canceled }: { canceled: boolean }) => {
      api.start({
        h: CELL_HEIGHT,
        immediate: false,
        config: canceled ? config.wobbly : config.stiff,
      });
    };
    const close = (velocity = 0) => {
      api.start({
        h: MAX_HEIGHT,
        immediate: false,
        config: { ...config.stiff, velocity },
      });
    };

    const bind = useDrag(
      ({
        last,
        velocity: [, vh],
        direction: [, dh],
        offset: [, oh],
        cancel,
        canceled,
      }) => {
        if (oh < -70) cancel();

        if (last) {
          oh > MAX_HEIGHT * 0.5 || (vh > 0.5 && dh > 0)
            ? close(vh)
            : open({ canceled });
        } else {
          api.start({
            h: clamp(oh, CELL_HEIGHT, MAX_HEIGHT),
            immediate: true,
          });
        }
      },
      {
        from: () => [0, h.get()],
        filterTaps: true,
        bounds: { top: 0 },
        rubberband: true,
      }
    );

    const handleClickDate = (date: Date) => {
      changeCurrentDate(date);
    };

    const handleChangeWeek = useCallback(
      (direct: number) => {
        changeCurrentDate(
          addWeeks(
            useCurrentDateStore.getState().currentDate,
            direct > 0 ? 1 : -1
          )
        );
      },
      [changeCurrentDate]
    );
    const handleChangeMonth = useCallback(
      (direct: number) => {
        changeCurrentDate(
          addMonths(
            useCurrentDateStore.getState().currentDate,
            direct > 0 ? 1 : -1
          )
        );
      },
      [changeCurrentDate]
    );

    return (
      <div
        ref={ref}
        className={cx("", className)}
        style={{ height: `${height}px` }}
      >
        <animated.div
          {...bind()}
          className="relative px-4"
          style={{
            height: h,
            touchAction: "none",
            overflow: "hidden",
          }}
        >
          {/**
           * 주단위 표기
           */}
          <animated.div
            style={{
              opacity: progress.to((v) => 1 - v),
              display: progress.to((v) => (v === 1 ? "none" : "block")),
            }}
          >
            <Swiper onChange={handleChangeWeek} width={width} className="h-12">
              {[-1, 0, 1].map((idx) => (
                <SwiperItem key={idx} index={idx}>
                  <Weeks
                    index={idx}
                    currentDate={currentDate}
                    onClickDate={handleClickDate}
                  />
                </SwiperItem>
              ))}
            </Swiper>
          </animated.div>
          {/**
           * 월단위 표기
           */}
          <animated.div
            className="absolute top-0 w-full"
            style={{
              opacity: progress,
              y: transitionY,
              display: progress.to((v) => (v === 0 ? "none" : "block")),
            }}
          >
            <Swiper onChange={handleChangeMonth} width={width}>
              {[-1, 0, 1].map((idx) => (
                <SwiperItem key={idx} index={idx}>
                  <div className="grid grid-cols-7 place-items-center">
                    {getCalendarDays(addMonths(currentDate, idx)).map(
                      (date) => (
                        <div
                          className="h-12 w-full flex flex-col place-items-center justify-center"
                          style={{
                            color:
                              date.getMonth() ===
                              addMonths(currentDate, idx).getMonth()
                                ? "#111111"
                                : "#cccccc",
                          }}
                          key={date.toISOString()}
                        >
                          <button
                            className={cx(
                              "rounded-full h-8 w-8 text-center flex flex-row justify-center place-items-center",
                              isSameDay(date, currentDate)
                                ? "bg-primary text-primary-foreground"
                                : "bg-transparent"
                            )}
                            onClick={() => handleClickDate(date)}
                          >
                            {date.getDate()}
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </SwiperItem>
              ))}
            </Swiper>
          </animated.div>
        </animated.div>
        <animated.div
          className="w-full flex flex-col justify-center place-items-center overflow-y-auto overflow-x-hidden"
          style={{ height: todoListHeight }}
        >
          <div className="w-[calc(100%_-_32px)] h-full">
            <DailyTodoList
              className="w-full"
              currentDate={currentDate}
            ></DailyTodoList>
          </div>
        </animated.div>
      </div>
    );
  }
);
DateSelector.displayName = "DateSelector";

const getCalendarDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDate = startOfMonth(date);
  const lastDate = lastDayOfMonth(date);

  const days = [];

  // 지난 달
  for (let i = firstDate.getDay() - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // 이번 달
  for (let i = 1; i <= lastDate.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // 다음 달
  const nextMonthDays = 42 - days.length; // 42 cells for 6 rows (7 columns)
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

const getWeekDays = (date: Date) => {
  const day = date.getDay();
  const firstDayOfWeek = addDays(date, -day);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(firstDayOfWeek, i));
  }

  return days;
};

const getWeek = (days: Date[], targetDate: Date) => {
  return Math.floor(days.findIndex((d) => isSameDay(targetDate, d)) / 7);
};

function Weeks({
  index,
  currentDate,
  onClickDate,
}: {
  currentDate: Date;
  index: number;
  onClickDate: (date: Date) => void;
}) {
  return (
    <div className="w-full flex flex-row">
      {getWeekDays(addWeeks(currentDate, index)).map((date) => (
        <div
          className="h-12 w-full flex flex-col place-items-center justify-center"
          key={date.toISOString()}
        >
          <button
            className={cx(
              "rounded-full h-8 w-8 text-center flex flex-row justify-center place-items-center transition-colors duration-300 bg-transparent text-black",
              isSameDay(date, currentDate)
                ? "bg-primary text-primary-foreground"
                : "bg-transparent"
            )}
            onClick={() => onClickDate(date)}
          >
            {date.getDate()}
          </button>
        </div>
      ))}
    </div>
  );
}
