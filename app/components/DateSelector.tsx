import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { clamp } from "@/utils/clamp";
import {
  addMonths,
  addWeeks,
  formatDate,
  isSameDay,
  isSaturday,
  isSunday,
} from "date-fns";
import { ComponentProps, useEffect, useState } from "react";
import { Swiper, SwiperItem } from "@/components/ui/Swiper";
import { DailyTodoList } from "./todo/DailyTodoList";
import { useCurrentDateStore } from "@/stores/current-date";
import { useShallow } from "zustand/shallow";
import { useMonthlyTodos } from "@/hooks/use-monthly-todos";
import { cn } from "@/utils/cn";
import {
  formatKoreanDate,
  getCalendarDays,
  getWeekDays,
} from "@/utils/date-time";
import { Button } from "terra-design-system/react";
import { useModeStore } from "@/stores/mode";
import { useMonthlyHolidays } from "@/hooks/use-monthly-holidays";
import { Holiday } from "@/types/holiday";
import { isHoliday } from "@/utils/helper/holiday";

const CELL_HEIGHT = 56;
const MIN_HEIGHT = CELL_HEIGHT * 1 + 20;
const MAX_HEIGHT = CELL_HEIGHT * 6 + 20;

type DateSelectorProps = ComponentProps<"div"> & {
  height: number;
  width: number;
};
export function DateSelector(props: DateSelectorProps) {
  const { className, width, height, ref } = props;
  const { currentDate, changeCurrentDate } = useCurrentDateStore(
    useShallow((state) => ({ ...state }))
  );
  const { data: holidays } = useMonthlyHolidays(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  const { isReorderMode, onReorderMode, offReorderMode } = useModeStore();
  const daysInCalendar = getCalendarDays(currentDate);
  const thisWeek = getWeek(daysInCalendar, currentDate);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [{ h }, api] = useSpring(() => ({
    h: MIN_HEIGHT,
    config: { tension: 10, friction: 26, mass: 0.3 },
  }));
  const todoListHeight = h.to((v) => Math.max(height - v, 0));
  const progress = h.to((v) =>
    clamp((v - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT), 0, 1)
  );
  const transitionY = progress.to((v) => {
    const startY = -thisWeek * CELL_HEIGHT;
    const y = startY * (1 - v);
    return y;
  });
  const preventEventInMotion = h.to((v) => {
    if (v !== MIN_HEIGHT && v !== MAX_HEIGHT && isDragging) return "none";
    return "auto";
  });
  const close = () => {
    api.start({
      h: MIN_HEIGHT,
      immediate: false,
      config: { tension: 100, friction: 20, clamp: true },
    });
  };
  const open = () => {
    api.start({
      h: MAX_HEIGHT,
      immediate: false,
      config: { tension: 100, friction: 20, clamp: true },
    });
  };

  const bind = useDrag(
    ({ last, velocity: [, vh], direction: [, dh], offset: [, oh], cancel }) => {
      if (oh < -70) {
        cancel();
        setIsDragging(false);
      }

      if (last) {
        if (oh < MIN_HEIGHT + 20 && dh <= 0) {
          close();
        } else if (oh > MAX_HEIGHT - 20 && dh >= 0) {
          open();
        } else if (vh > 0.05 && dh > 0) {
          open();
        } else if (vh > 0.05 && dh < 0) {
          close();
        } else {
          oh > MAX_HEIGHT * 0.5 ? open() : close();
        }

        setIsDragging(false);
      } else {
        api.start({
          h: clamp(oh, MIN_HEIGHT, MAX_HEIGHT),
          immediate: true,
        });
        setIsDragging(true);
      }
    },
    {
      from: () => [0, h.get()],
      filterTaps: true,
      threshold: 10,
      bounds: { top: 0 },
      rubberband: true,
      axis: "lock",
    }
  );

  const handleClickDate = (date: Date) => {
    changeCurrentDate(date);
  };

  const handleChangeWeek = (direct: number) => {
    changeCurrentDate(
      addWeeks(useCurrentDateStore.getState().currentDate, direct > 0 ? 1 : -1)
    );
  };

  const handleChangeMonth = (direct: number) => {
    changeCurrentDate(
      addMonths(useCurrentDateStore.getState().currentDate, direct > 0 ? 1 : -1)
    );
  };

  const handleClickOnReorderMode = () => {
    onReorderMode();
  };

  useEffect(() => {
    offReorderMode();
  }, [currentDate, offReorderMode]);

  const { incompletedTodos, completedTodos } = useMonthlyTodos(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const totalTodoMap = [...incompletedTodos, ...completedTodos].reduce(
    (map, todo) => {
      const key = `${todo.date.month}-${todo.date.day}`;
      const [prevDone, prevTotal] = map.get(key) ?? [0, 0];
      map.set(key, [prevDone + (todo.isCompleted ? 1 : 0), prevTotal + 1]);

      return map;
    },
    new Map<string, [number, number]>()
  );

  return (
    <div
      ref={ref}
      className={cn("", className)}
      style={{ height: `${height}px` }}
    >
      <time
        dateTime={formatDate(currentDate, "yyyy-MM")}
        className="font-bold text-lg pl-8"
      >
        {formatKoreanDate(currentDate, "yyyy년 MM월")}
      </time>
      <animated.div
        {...bind()}
        className={cn("relative px-4")}
        style={{
          height: h,
          touchAction: "none",
          overflow: "hidden",
          pointerEvents: preventEventInMotion,
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
          <Swiper onChange={handleChangeWeek} width={width} className="h-16">
            {[-1, 0, 1].map((idx) => (
              <SwiperItem key={idx} index={idx}>
                <Weeks
                  index={idx}
                  currentDate={currentDate}
                  totalTodoMap={totalTodoMap}
                  holidays={holidays ?? []}
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
                <Months
                  currentDate={currentDate}
                  index={idx}
                  totalTodoMap={totalTodoMap}
                  holidays={holidays ?? []}
                  onClickDate={handleClickDate}
                />
              </SwiperItem>
            ))}
          </Swiper>
        </animated.div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-400 h-1 w-8 rounded-full cursor-pointer"></div>
      </animated.div>
      <animated.div
        className="w-full flex flex-col justify-center place-items-center overflow-y-hidden"
        style={{ height: todoListHeight }}
      >
        <div className="pt-4 w-full h-full">
          <div className="h-8 flex flex-row-reverse px-4">
            {!isReorderMode && (
              <Button
                theme="neutral"
                size="xs"
                variant="ghost"
                onClick={handleClickOnReorderMode}
                className="text-xs"
              >
                순서 바꾸기
              </Button>
            )}
          </div>
          <div className="w-full h-[calc(100%_-_2rem)] overflow-y-auto">
            <DailyTodoList
              className="w-full pb-20"
              currentDate={currentDate}
              reorderMode={isReorderMode}
            ></DailyTodoList>
          </div>
        </div>
      </animated.div>
    </div>
  );
}

const getWeek = (days: Date[], targetDate: Date) => {
  return Math.floor(days.findIndex((d) => isSameDay(targetDate, d)) / 7);
};

function Weeks({
  index,
  currentDate,
  totalTodoMap,
  holidays,
  onClickDate,
}: {
  currentDate: Date;
  index: number;
  totalTodoMap: Map<string, [number, number]>;
  holidays: Holiday[];
  onClickDate: (date: Date) => void;
}) {
  const weekDays = getWeekDays(addWeeks(currentDate, index));

  return (
    <div className="w-full flex flex-row">
      {weekDays.map((date) => (
        <button
          className="relative h-14 w-full flex flex-col place-items-center justify-center"
          key={date.toISOString()}
          onClick={() => onClickDate(date)}
        >
          <div
            className={cn(
              "rounded-full h-8 w-8 text-center flex flex-row justify-center place-items-center transition-colors duration-300 bg-transparent",
              isSunday(date) && "text-red-500",
              isSaturday(date) && "text-blue-500",
              isHoliday(holidays, date) && "text-red-500",
              isSameDay(date, currentDate)
                ? "bg-primary text-primary-fg"
                : "bg-transparent"
            )}
          >
            {date.getDate()}
          </div>
          <small className="absolute top-11 text-[10px]">
            {totalTodoMap
              .get(`${date.getMonth() + 1}-${date.getDate()}`)
              ?.join("/")}
          </small>
        </button>
      ))}
    </div>
  );
}

function Months({
  index,
  currentDate,
  totalTodoMap,
  holidays,
  onClickDate,
}: {
  currentDate: Date;
  index: number;
  totalTodoMap: Map<string, [number, number]>;
  holidays: Holiday[];
  onClickDate: (date: Date) => void;
}) {
  return (
    <div className="grid grid-cols-7 place-items-center">
      {getCalendarDays(addMonths(currentDate, index)).map((date) => (
        <div
          className="relative h-14 w-full flex flex-col place-items-center justify-center"
          style={{
            opacity:
              date.getMonth() === addMonths(currentDate, index).getMonth()
                ? 1
                : 0.3,
          }}
          key={date.toISOString()}
        >
          <button
            className={cn(
              "rounded-full h-8 w-8 text-center flex flex-row justify-center place-items-center",
              isSunday(date) && "text-red-500",
              isSaturday(date) && "text-blue-500",
              isHoliday(holidays, date) && "text-red-500",
              isSameDay(date, currentDate)
                ? "bg-primary text-primary-fg"
                : "bg-transparent"
            )}
            onClick={() => onClickDate(date)}
          >
            {date.getDate()}
          </button>
          <small className="absolute top-11 text-[10px]">
            {totalTodoMap
              .get(`${date.getMonth() + 1}-${date.getDate()}`)
              ?.join("/")}
          </small>
        </div>
      ))}
    </div>
  );
}
