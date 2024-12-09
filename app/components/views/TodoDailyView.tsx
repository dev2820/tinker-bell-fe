import { cn } from "@/lib/utils";
import {
  calcRelativeDate,
  formatDate,
  formatKoreanDate,
} from "@/utils/date-time";
import { range } from "@/utils/range";
import { AnimatePresence, Reorder } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  MouseEvent,
  ChangeEvent,
  ComponentProps,
  useMemo,
  useState,
} from "react";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { TodoDraggableItem } from "../todo/TodoDraggableItem";
import "swiper/css";
import "swiper/css/virtual";
import { useTodoDetailDrawerStore } from "@/stores/todo-detail-drawer";
import { useCurrentDateStore } from "@/stores/current-date";
import { TodoLoadMore } from "../todo/TodoLoadMore";
import { useDailyTodos } from "@/hooks/use-daily-todos";

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
                <TodoView
                  currentDate={calcRelativeDate(baseDate, slideContent)}
                ></TodoView>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

type TodoViewProps = {
  currentDate: Date;
};
function TodoView(props: TodoViewProps) {
  const { currentDate } = props;
  const {
    completedTodos,
    incompletedTodos,
    toggleTodoById,
    reorderIncompletedTodos,
    reorderCompletedTodos,
  } = useDailyTodos(currentDate);
  const todoDetailDrawer = useTodoDetailDrawerStore();

  const handleChangeComplete = (e: ChangeEvent<HTMLElement>) => {
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);

    toggleTodoById(todoId);
  };
  const handleClickTodoItem = (e: MouseEvent<HTMLElement>) => {
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);

    const todo = [...incompletedTodos, ...completedTodos]?.find(
      (todo) => todo.id === todoId
    );
    if (todo) {
      todoDetailDrawer.changeCurrentTodo(todo);
    }
    todoDetailDrawer.onOpen();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="overflow-y-scroll pb-4">
        <Reorder.Group
          axis="y"
          as="ul"
          values={incompletedTodos}
          onReorder={reorderIncompletedTodos}
          layoutScroll
          className="px-4 overflow-y-hidden overflow-x-hidden"
        >
          <AnimatePresence>
            {incompletedTodos.map((todo) => (
              <TodoDraggableItem
                key={todo.id}
                todo={todo}
                onChangeComplete={handleChangeComplete}
                onClickTodo={handleClickTodoItem}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <hr className="w-[calc(100%_-_32px)] mx-auto my-4" />
        <Reorder.Group
          axis="y"
          as="ul"
          values={completedTodos}
          onReorder={reorderCompletedTodos}
          layoutScroll
          className="px-4 overflow-y-hidden overflow-x-hidden"
        >
          <AnimatePresence>
            {completedTodos.map((todo) => (
              <TodoDraggableItem
                key={todo.id}
                todo={todo}
                onChangeComplete={handleChangeComplete}
                onClickTodo={handleClickTodoItem}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>
    </div>
  );
}
