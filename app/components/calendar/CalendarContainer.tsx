import "swiper/css";
import "swiper/css/virtual";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";

import { calcRelativeMonth } from "@/utils/date-time";
import { ComponentProps, ReactNode } from "react";
import { range } from "@/utils/range";
import { useCalendar } from "./CalendarRoot";
import { addMonths } from "date-fns";

type CalendarContainerProps = Omit<ComponentProps<"div">, "children"> & {
  children: (year: number, month: number) => ReactNode;
};

const slides = range(-500, 500, 1);
const initialSlideIndex = slides.length / 2;

export function CalendarContainer(props: CalendarContainerProps) {
  const { className, children, ...rest } = props;
  const { baseDate, setSwiperRef, onChangeShownDate } = useCalendar();

  const handleSlideChange = (swiper: SwiperType) => {
    const newDate = addMonths(baseDate, slides[swiper.activeIndex]);
    onChangeShownDate(newDate);
  };

  return (
    <div className={className} {...rest}>
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
            {children(
              calcRelativeMonth(baseDate, slideContent).getFullYear(),
              calcRelativeMonth(baseDate, slideContent).getMonth()
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
