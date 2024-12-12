import { useDrag } from "@use-gesture/react";
import { useSpring, animated, config } from "@react-spring/web";
import { clamp } from "@/utils/clamp";
import { isSameDay, isThisMonth, lastDayOfMonth, startOfMonth } from "date-fns";

const CELL_HEIGHT = 48;
const MAX_HEIGHT = CELL_HEIGHT * 6;

type DateSelectorProps = {
  currentDate: Date;
  onChangeDate?: (newDate: Date) => void;
};
export function DateSelector(props: DateSelectorProps) {
  const { currentDate, onChangeDate } = props;

  const daysInCalendar = getCalendarDays(currentDate);
  const thisWeek = getWeek(daysInCalendar, currentDate);
  const [{ h }, api] = useSpring(() => ({
    h: MAX_HEIGHT,
    config: { tension: 10, friction: 26, mass: 0.3 },
  }));
  const opacity = h.to((v) => {
    return (v - CELL_HEIGHT) / (MAX_HEIGHT - CELL_HEIGHT);
  });
  const transitionY = h.to((v) => {
    const startY = -thisWeek * CELL_HEIGHT;
    const progress = (v - CELL_HEIGHT) / (MAX_HEIGHT - CELL_HEIGHT);
    const y = startY * (1 - progress);
    // thisWeek이 1이면
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

  return (
    <animated.div
      {...bind()}
      style={{
        height: h,
        touchAction: "none",
        overflow: "hidden",
        borderWidth: 1,
      }}
    >
      <animated.div
        style={{ y: transitionY }}
        className="grid grid-cols-7 place-items-center"
      >
        {daysInCalendar.map((date) => (
          <animated.div
            className="h-12"
            style={{
              color:
                date.getMonth() === currentDate.getMonth()
                  ? "#111111"
                  : "#cccccc",
              opacity: getWeek(daysInCalendar, date) === thisWeek ? 1 : opacity,
            }}
            key={date.toISOString()}
          >
            {date.getDate()}
          </animated.div>
        ))}
      </animated.div>
    </animated.div>
  );
}

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

const getWeek = (days: Date[], targetDate: Date) => {
  return Math.floor(days.findIndex((d) => isSameDay(targetDate, d)) / 7);
};
