import { cn } from "@/lib/utils";
import { calcRelativeMonth, formatKoreanDate } from "@/utils/date-time";
import { range } from "@/utils/range";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ComponentProps, useMemo, useState } from "react";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { Toast } from "terra-design-system/react";
import { useToast } from "@/contexts/toast";
import "swiper/css";
import "swiper/css/virtual";
import { TodoFilterDialog } from "@/components/dialog/TodoFilterDialog";
import { CalendarGrid } from "../calendar/CalendarGrid";

const slides = range(-500, 500, 1);
const initialSlideIndex = slides.length / 2;

type TodoCalendarViewProps = ComponentProps<"div">;
export function TodoCalendarView(props: TodoCalendarViewProps) {
  const { className, ...rest } = props;
  const [currentSlideIndex, setCurrentSlideIndex] =
    useState<number>(initialSlideIndex);

  const relativeDate = useMemo(
    () => calcRelativeMonth(new Date(), slides[currentSlideIndex]),
    [currentSlideIndex]
  );
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  const { toaster } = useToast();

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlideIndex(swiper.activeIndex);
  };

  const handleGotoPrevMonth = () => {
    if (!swiperRef) {
      return;
    }
    swiperRef.slidePrev(0);
  };

  const handleGotoNextMonth = () => {
    if (!swiperRef) {
      return;
    }
    swiperRef.slideNext(0);
  };

  return (
    <div className={cn(className)} {...rest}>
      <h2 className="h-[56px] text-center pt-4">
        <div className="relative flex flex-row place-items-center justify-center gap-3">
          <button onClick={handleGotoPrevMonth}>
            <ChevronLeftIcon size={28} strokeWidth={1} />
          </button>
          <time className="block w-24">
            {formatKoreanDate(relativeDate, "yyyy년 MM월")}
          </time>
          <button onClick={handleGotoNextMonth}>
            <ChevronRightIcon size={28} strokeWidth={1} />
          </button>
          <TodoFilterDialog className={"absolute right-4 -top-1.5"} />
        </div>
      </h2>
      <div className="h-[calc(100%_-_56px)] w-full px-4">
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
              <CalendarView
                currentYear={calcRelativeMonth(
                  relativeDate,
                  slideContent
                ).getFullYear()}
                currentMonth={calcRelativeMonth(
                  relativeDate,
                  slideContent
                ).getMonth()}
              ></CalendarView>
            </SwiperSlide>
          ))}
        </Swiper>
        <Toast.Toaster toaster={toaster}>
          {(toast) => (
            <Toast.Root
              key={toast.id}
              className="bg-neutral-800 py-3 w-full min-w-[calc(100vw_-_32px)]"
            >
              <Toast.Description className="text-white">
                {toast.description}
              </Toast.Description>
              <Toast.CloseTrigger asChild className="top-1.5">
                <button className="text-md text-primary rounded-md px-2 py-1">
                  확인
                </button>
              </Toast.CloseTrigger>
            </Toast.Root>
          )}
        </Toast.Toaster>
      </div>
    </div>
  );
}

function CalendarView({
  currentYear,
  currentMonth,
}: {
  currentYear: number;
  currentMonth: number;
}) {
  const handleSelectDate = (dateStr: string) => {
    console.log(dateStr);
  };
  return (
    <CalendarGrid
      className=""
      year={currentYear}
      month={currentMonth}
      today={new Date()}
      onSelect={handleSelectDate}
    ></CalendarGrid>
  );
}
