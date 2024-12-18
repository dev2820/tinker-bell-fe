import { useDrag } from "@use-gesture/react";
import { useSpring, animated, config } from "@react-spring/web";
import { clamp } from "@/utils/clamp";
import { addMonths, addWeeks, isSameDay, isSaturday, isSunday } from "date-fns";
import { forwardRef, useCallback } from "react";
import { Swiper, SwiperItem } from "@/components/ui/Swiper";
import { DailyTodoList } from "./todo/DailyTodoList";
import { useCurrentDateStore } from "@/stores/current-date";
import { useShallow } from "zustand/shallow";
import { useMonthlyTodos } from "@/hooks/use-monthly-todos";
import { useTodos } from "@/hooks/use-todos";
import { cn } from "@/lib/utils";
import { getCalendarDays, getWeekDays } from "@/utils/date-time";

const CELL_HEIGHT = 56;
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
          oh > MAX_HEIGHT * 0.9 || (vh > 0.15 && dh > 0)
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
        threshold: 20,
        bounds: { top: 0 },
        rubberband: true,
        axis: "lock",
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
        className={cn("", className)}
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
            <Swiper onChange={handleChangeWeek} width={width} className="h-16">
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
                  <Months
                    currentDate={currentDate}
                    index={idx}
                    onClickDate={handleClickDate}
                  />
                </SwiperItem>
              ))}
            </Swiper>
          </animated.div>
        </animated.div>
        <animated.div
          className="pt-4 w-full flex flex-col justify-center place-items-center overflow-y-hidden"
          style={{ height: todoListHeight }}
        >
          <div className="w-full h-full pt-4 overflow-y-auto">
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
  const weekDays = getWeekDays(addWeeks(currentDate, index));
  const { incompletedTodos, completedTodos } = useTodos(
    weekDays[0],
    weekDays[weekDays.length - 1]
  );

  const totalTodoMap = [...incompletedTodos, ...completedTodos]?.reduce(
    (map, todo) => {
      const key = `${todo.date.month}-${todo.date.day}`;
      const [prevDone, prevTotal] = map.get(key) ?? [0, 0];
      map.set(key, [prevDone + (todo.isCompleted ? 1 : 0), prevTotal + 1]);

      return map;
    },
    new Map<string, [number, number]>()
  );

  return (
    <div className="w-full flex flex-row">
      {weekDays.map((date) => (
        <div
          className="relative h-14 w-full flex flex-col place-items-center justify-center"
          key={date.toISOString()}
        >
          <button
            className={cn(
              "rounded-full h-8 w-8 text-center flex flex-row justify-center place-items-center transition-colors duration-300 bg-transparent text-black",
              isSunday(date) && "text-red-500",
              isSaturday(date) && "text-blue-500",
              isSameDay(date, currentDate)
                ? "bg-primary text-primary-foreground"
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

function Months({
  index,
  currentDate,
  onClickDate,
}: {
  currentDate: Date;
  index: number;
  onClickDate: (date: Date) => void;
}) {
  const { incompletedTodos, completedTodos } = useMonthlyTodos(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const totalTodoMap = [...incompletedTodos, ...completedTodos]?.reduce(
    (map, todo) => {
      const key = `${todo.date.month}-${todo.date.day}`;
      const [prevDone, prevTotal] = map.get(key) ?? [0, 0];
      map.set(key, [prevDone + (todo.isCompleted ? 1 : 0), prevTotal + 1]);

      return map;
    },
    new Map<string, [number, number]>()
  );

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
              isSameDay(date, currentDate)
                ? "bg-primary text-primary-foreground"
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
