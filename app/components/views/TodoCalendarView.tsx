import { cn } from "@/lib/utils";
import {
  calcRelativeMonth,
  formatKoreanDate,
  isSameDay,
} from "@/utils/date-time";
import { range } from "@/utils/range";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  MouseEvent,
  ChangeEvent,
  ComponentProps,
  useMemo,
  useState,
  useEffect,
} from "react";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { Button, Toast } from "terra-design-system/react";
import { useToast } from "@/contexts/toast";
import "swiper/css";
import "swiper/css/virtual";
import { TodoFilterDialog } from "@/components/dialog/TodoFilterDialog";
import { CalendarGrid } from "../calendar/CalendarGrid";
import { AnimatePresence, Reorder } from "framer-motion";
import { TodoDraggableItem } from "../todo/TodoDraggableItem";
import { Todo } from "@/types/todo";
import { useSettingStore } from "@/stores/setting";
import { useTodo } from "@/hooks/use-todo";
import { useAddTodoDrawerStore } from "@/stores/add-todo-drawer";
import { useTodoDetailDrawerStore } from "@/stores/todo-detail-drawer";
import { addMonths, getMonth, getYear, isSameMonth, subMonths } from "date-fns";

const slides = range(-500, 500, 1);
const initialSlideIndex = slides.length / 2;

type TodoCalendarViewProps = ComponentProps<"div">;
export function TodoCalendarView(props: TodoCalendarViewProps) {
  const { className, ...rest } = props;
  const [currentSlideIndex, setCurrentSlideIndex] =
    useState<number>(initialSlideIndex);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const relativeDate = useMemo(() => {
    const d = new Date();
    const year = getYear(d);
    const month = getMonth(d);
    return calcRelativeMonth(new Date(year, month), slides[currentSlideIndex]);
  }, [currentSlideIndex]);
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

  const handleSelectDate = (dateStr: string) => {
    const selectedDate = new Date(dateStr);
    /**
     * 선택한게 다음달이면 slide를 하나 이동
     */
    const nextMonthDate = addMonths(relativeDate, 1);
    const prevMonthDate = subMonths(relativeDate, 1);
    if (isSameMonth(selectedDate, nextMonthDate)) {
      swiperRef?.slideNext(200);
    }
    if (isSameMonth(selectedDate, prevMonthDate)) {
      swiperRef?.slidePrev(200);
    }
    setSelectedDate(new Date(dateStr));
  };
  console.log(relativeDate, slides[currentSlideIndex]);
  return (
    <div className={cn(className)} {...rest}>
      <header className="h-[56px] text-center pt-4">
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
      </header>
      <div className="h-[calc(100%_-_56px)] w-full">
        <div className="px-4">
          <Swiper
            modules={[Virtual]}
            className="h-[248px] w-full"
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
                <CalendarGrid
                  className=""
                  year={calcRelativeMonth(
                    relativeDate,
                    slideContent
                  ).getFullYear()}
                  month={calcRelativeMonth(
                    relativeDate,
                    slideContent
                  ).getMonth()}
                  today={selectedDate}
                  onSelect={handleSelectDate}
                ></CalendarGrid>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <section className="h-[calc(100%_-_248px)] pt-4">
          <h3 className="h-[24px] px-4">
            {formatKoreanDate(selectedDate, "yyyy년 MM월 dd일")}{" "}
            {isSameDay(selectedDate, new Date()) && `(오늘)`}
          </h3>
          <TodoView
            className="h-[calc(100%_-_24px)]"
            currentDate={selectedDate}
          />
        </section>
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

type TodoViewProps = {
  className?: string;
  currentDate: Date;
};
function TodoView(props: TodoViewProps) {
  const { currentDate, className } = props;
  const { filterOption } = useSettingStore();
  const { todos, toggleTodoById, debouncedReorderTodos } = useTodo(currentDate);
  const addTodoDrawer = useAddTodoDrawerStore();
  const todoDetailDrawer = useTodoDetailDrawerStore();
  const [orderedTodos, setOrderedTodos] = useState<Todo[]>(
    todos?.filter((todo) =>
      filterOption === "all"
        ? true
        : filterOption === "completed"
        ? todo.isCompleted
        : !todo.isCompleted
    ) ?? []
  );

  useEffect(() => {
    setOrderedTodos(
      todos?.filter((todo) =>
        filterOption === "all"
          ? true
          : filterOption === "completed"
          ? todo.isCompleted
          : !todo.isCompleted
      ) ?? []
    );
  }, [filterOption, todos]);

  const handleChangeComplete = (e: ChangeEvent<HTMLElement>) => {
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);

    toggleTodoById(todoId);
  };
  const handleClickTodoItem = (e: MouseEvent<HTMLElement>) => {
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);

    const todo = todos?.find((todo) => todo.id === todoId);
    if (todo) {
      todoDetailDrawer.changeCurrentTodo(todo);
    }
    todoDetailDrawer.onOpen();
  };

  const handleReorder = (newOrder: Todo[]) => {
    setOrderedTodos(newOrder);
    debouncedReorderTodos(newOrder);
  };

  const handleClickAddTodo = () => {
    addTodoDrawer.onOpen();
  };
  return (
    <div className={cn("overflow-y-auto", className)}>
      <div className="overflow-y-scroll pb-4 px-4">
        <Reorder.Group
          axis="y"
          as="ul"
          values={orderedTodos}
          onReorder={handleReorder}
          layoutScroll
          className="overflow-y-hidden overflow-x-hidden"
        >
          <AnimatePresence>
            {orderedTodos.map((todo) => (
              <TodoDraggableItem
                key={todo.id}
                todo={todo}
                onChangeComplete={handleChangeComplete}
                onClickTodo={handleClickTodoItem}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <Button
          className="w-full mb-2"
          theme="primary"
          size="lg"
          onClick={handleClickAddTodo}
        >
          + 할 일 추가하기
        </Button>
      </div>
    </div>
  );
}
