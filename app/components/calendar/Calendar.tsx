import { useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { range } from "@/utils/range";

const slides = range(-500, 500, 1);
const initialSlideIndex = slides.length / 2;

const Calendar = ({
  today,
  onSelect,
}: {
  today: Date;
  onSelect?: (dateStr: string) => void;
}) => {
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth())
  );

  const handleMonthChange = (delta: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + delta,
      1
    );
    setCurrentDate(newDate);
  };

  const handleSelectDate = (dateStr: string) => {
    onSelect?.(dateStr);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    const newDate = new Date(
      today.getFullYear(),
      today.getMonth() + slides[swiper.activeIndex],
      1
    );
    setCurrentDate(newDate);
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
        initialSlide={initialSlideIndex}
        virtual
      >
        {slides.map((slideContent, index) => (
          <SwiperSlide key={slideContent} virtualIndex={index}>
            <CalendarGrid
              className="w-full h-full"
              year={new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + slideContent
              ).getFullYear()}
              month={new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + slideContent
              ).getMonth()}
              today={today}
              onSelect={handleSelectDate}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Calendar;
