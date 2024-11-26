import { useMemo, useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { range } from "@/utils/range";
import { getMonth, getYear } from "date-fns";
import { calcRelativeMonth } from "@/utils/date-time";
import { CalendarCell } from "./CalendarCell";

const slides = range(-500, 500, 1);
const initialSlideIndex = slides.length / 2;

const Calendar = ({
  today,
  onSelect,
}: {
  today: Date;
  onSelect?: (dateStr: string) => void;
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] =
    useState<number>(initialSlideIndex);
  const currentDate = useMemo(() => {
    const year = getYear(today);
    const month = getMonth(today);
    return calcRelativeMonth(new Date(year, month), slides[currentSlideIndex]);
  }, [currentSlideIndex, today]);
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  const handleMonthChange = (delta: number) => {
    if (delta > 0) {
      swiperRef?.slideNext(0);
    }
    if (delta < 0) {
      swiperRef?.slidePrev(0);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    swiperRef?.slideTo(initialSlideIndex, 0);
    onSelect?.(dateStr);
    setCurrentSlideIndex(initialSlideIndex);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlideIndex(swiper.activeIndex);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg">
      <CalendarHeader
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        onMonthChange={handleMonthChange}
      />
      <Swiper
        modules={[Virtual]}
        className="h-full w-full"
        slidesPerView={1}
        onSlideChange={handleSlideChange}
        centeredSlides={true}
        spaceBetween={0}
        onSwiper={setSwiperRef}
        initialSlide={initialSlideIndex}
        virtual
      >
        {slides.map((slideContent, index) => (
          <SwiperSlide key={slideContent} virtualIndex={index}>
            <CalendarGrid
              className="w-full h-full"
              year={new Date(
                today.getFullYear(),
                today.getMonth() + slideContent
              ).getFullYear()}
              month={new Date(
                today.getFullYear(),
                today.getMonth() + slideContent
              ).getMonth()}
              today={today}
              onSelect={handleSelectDate}
              renderCalendarCell={({ key, ...rest }) => (
                <CalendarCell {...rest} key={key} />
              )}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Calendar;
