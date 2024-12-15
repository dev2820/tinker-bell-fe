import { useDrag } from "@use-gesture/react";
import { useSpring, animated, config } from "@react-spring/web";
import { clamp } from "@/utils/clamp";
import { isSameDay, lastDayOfMonth, startOfMonth } from "date-fns";
import { forwardRef, useMemo, useState } from "react";
import { calcRelativeDate } from "@/utils/date-time";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { DailyTodoList } from "./todo/DailyTodoList";
import { TodoLoadMore } from "./todo/TodoLoadMore";
import { Swiper as SwiperType } from "swiper/types";
import { range } from "@/utils/range";
import { cx } from "@/utils/cx";

const CELL_HEIGHT = 48;
const MAX_HEIGHT = CELL_HEIGHT * 6;
const slides = range(-500, 500, 1);
const initialSlideIndex = slides.length / 2;

type DateSelectorProps = {
  currentDate: Date;
  onChangeDate?: (newDate: Date) => void;
  className?: string;
  height: number;
};
export const DateSelector = forwardRef<HTMLDivElement, DateSelectorProps>(
  function (props, ref) {
    const { className, height, currentDate, onChangeDate } = props;
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
    const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
    const [baseDate, setBaseDate] = useState<Date>(currentDate);
    const [currentSlideIndex, setCurrentSlideIndex] =
      useState<number>(initialSlideIndex);

    const relativeDate = useMemo(
      () => calcRelativeDate(baseDate, slides[currentSlideIndex]),
      [baseDate, currentSlideIndex]
    );
    const handleSlideChange = (swiper: SwiperType) => {
      setCurrentSlideIndex(swiper.activeIndex);
      onChangeDate?.(calcRelativeDate(baseDate, slides[swiper.activeIndex]));
    };
    const handleClickDate = (date: Date) => {
      setBaseDate(date);
      onChangeDate?.(date);
    };

    const handleClickLoadMore = () => {
      if (!swiperRef) {
        return;
      }

      setBaseDate(relativeDate);
      swiperRef.slideTo(initialSlideIndex, 0);
    };

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
          <animated.div
            style={{ y: transitionY }}
            className="grid grid-cols-7 place-items-center"
          >
            {daysInCalendar.map((date) => (
              <animated.div
                className="h-12 w-full flex flex-col place-items-center justify-center"
                style={{
                  color:
                    date.getMonth() === currentDate.getMonth()
                      ? "#111111"
                      : "#cccccc",
                  opacity: progress.to((v) => {
                    return Math.max(
                      v,
                      getWeek(daysInCalendar, date) === thisWeek ? 1 : 0
                    );
                  }),
                }}
                key={date.toISOString()}
              >
                <button
                  className={cx(
                    "rounded-full h-8 w-8 text-center flex flex-row justify-center place-items-center",
                    isSameDay(date, currentDate)
                      ? "bg-primary-subtle"
                      : "bg-transparent"
                  )}
                  onClick={() => handleClickDate(date)}
                >
                  {date.getDate()}
                </button>
              </animated.div>
            ))}
          </animated.div>
        </animated.div>
        <animated.div className="w-full" style={{ height: todoListHeight }}>
          <Swiper
            modules={[Virtual]}
            className="h-full w-full"
            slidesPerView={1}
            onSwiper={setSwiperRef}
            onSlideChange={handleSlideChange}
            centeredSlides={true}
            spaceBetween={0}
            initialSlide={initialSlideIndex}
            virtual
          >
            {slides.map((slideContent, index) => (
              <SwiperSlide key={slideContent} virtualIndex={index}>
                {[slides[0], slides.at(-1)].some((s) => s === slideContent) && (
                  <TodoLoadMore onClickLoadMore={handleClickLoadMore} />
                )}
                {[slides[0], slides.at(-1)].every(
                  (s) => s !== slideContent
                ) && (
                  <DailyTodoList
                    className="h-full"
                    currentDate={calcRelativeDate(baseDate, slideContent)}
                  ></DailyTodoList>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
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

const getWeek = (days: Date[], targetDate: Date) => {
  return Math.floor(days.findIndex((d) => isSameDay(targetDate, d)) / 7);
};
