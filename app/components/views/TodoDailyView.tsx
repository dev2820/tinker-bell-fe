import { cn } from "@/lib/utils";
import {
  calcRelativeDate,
  formatDate,
  formatKoreanDate,
} from "@/utils/date-time";
import { range } from "@/utils/range";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ComponentProps, useMemo, useState } from "react";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/virtual";
import { useCurrentDateStore } from "@/stores/current-date";
import { TodoLoadMore } from "../todo/TodoLoadMore";
import { DailyTodoList } from "../todo/DailyTodoList";

const slides = range(-500, 500, 1);
const initialSlideIndex = slides.length / 2;

type TodoDailyViewProps = ComponentProps<"div">;
export function TodoDailyView(props: TodoDailyViewProps) {
  const { className, ...rest } = props;
  const { currentDate, changeCurrentDate } = useCurrentDateStore();
  const [baseDate, setBaseDate] = useState<Date>(currentDate);
  const [currentSlideIndex, setCurrentSlideIndex] =
    useState<number>(initialSlideIndex);

  const relativeDate = useMemo(
    () => calcRelativeDate(baseDate, slides[currentSlideIndex]),
    [baseDate, currentSlideIndex]
  );
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlideIndex(swiper.activeIndex);
    changeCurrentDate(calcRelativeDate(baseDate, slides[swiper.activeIndex]));
  };

  const handleClickLoadMore = () => {
    if (!swiperRef) {
      return;
    }

    setBaseDate(relativeDate);
    swiperRef.slideTo(initialSlideIndex, 0);
  };

  const handleGotoPrevDate = () => {
    if (!swiperRef) {
      return;
    }
    swiperRef.slidePrev(0);
    changeCurrentDate(
      calcRelativeDate(baseDate, slides[currentSlideIndex - 1])
    );
  };

  const handleGotoNextDate = () => {
    if (!swiperRef) {
      return;
    }
    swiperRef.slideNext(0);
    changeCurrentDate(
      calcRelativeDate(baseDate, slides[currentSlideIndex + 1])
    );
  };

  return (
    <div className={cn("pb-4", className)} {...rest}>
      <h2 className="h-[72px] text-center pt-4">
        <small className="block">
          {formatKoreanDate(relativeDate, "yyyy년 MM월 dd일")}
        </small>
        <div className="relative flex flex-row place-items-center justify-center gap-3">
          <button onClick={handleGotoPrevDate}>
            <ChevronLeftIcon size={28} strokeWidth={1} />
          </button>
          <time
            dateTime={formatDate(relativeDate, "yyyy-MM-dd")}
            className="font-bold w-12"
          >
            {formatKoreanDate(relativeDate, "EEEE")}
          </time>
          <button onClick={handleGotoNextDate}>
            <ChevronRightIcon size={28} strokeWidth={1} />
          </button>
        </div>
      </h2>
      <div className="h-[calc(100%_-_72px)] w-full">
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
              {[slides[0], slides.at(-1)].every((s) => s !== slideContent) && (
                <DailyTodoList
                  className="h-full"
                  currentDate={calcRelativeDate(baseDate, slideContent)}
                ></DailyTodoList>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
