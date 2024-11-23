import { cn } from "@/lib/utils";
import { useSettingStore } from "@/stores/setting";
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
  useEffect,
} from "react";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { Toast, Button } from "terra-design-system/react";
import { TodoDraggableItem } from "../todo/TodoDraggableItem";
import { vibrateShort } from "@/utils/device/vibrate";
import { useTodo } from "@/hooks/use-todo";
import { useToast } from "@/contexts/toast";
import { Todo } from "@/types/todo";
import "swiper/css";
import "swiper/css/virtual";
import { useTodoDetailDrawerStore } from "@/stores/todo-detail-drawer";
import { useAddTodoDrawerStore } from "@/stores/add-todo-drawer";
import { useCurrentDateStore } from "@/stores/current-date";
import { TodoFilterDialog } from "@/components/dialog/TodoFilterDialog";

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

  const { todos, toggleTodoById } = useTodo(relativeDate);
  const detailDrawer = useTodoDetailDrawerStore();
  const addTodoDrawer = useAddTodoDrawerStore();

  const { toaster, showToast } = useToast();

  const handleClickTodoItem = (todoId: number) => {
    if (!todos) {
      return;
    }
    const todo = todos.find((todo) => todo.id === todoId);
    if (todo) {
      detailDrawer.changeCurrentTodo(todo);
    }
    detailDrawer.onOpen();
  };
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

  const handleChangeTodoComplete = (todoId: number) => {
    if (!todos) {
      return null;
    }
    const targetTodo = todos.find((todo) => todo.id === todoId);
    if (!targetTodo) {
      return null;
    }

    toggleTodoById(targetTodo.id);
    if (!targetTodo.isCompleted) {
      /**
       * TODO: undo action 만들기
       */
      showToast({
        description: `작업 완료! 🥳`,
      });
    }
    vibrateShort();
  };

  return (
    <div className={cn(className)} {...rest}>
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
          <TodoFilterDialog className={"absolute right-4 -top-1.5"} />
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
                <div className="h-full overflow-y-auto flex flex-col items-center justify-center">
                  <p className="text-center mb-8">
                    다음 날짜의 Todo를 불러오려면 아래 &apos;더 불러오기&apos;
                    버튼을 눌러주세요.
                  </p>
                  <Button theme="primary" onClick={handleClickLoadMore}>
                    더 불러오기
                  </Button>
                </div>
              )}
              {[slides[0], slides.at(-1)].every((s) => s !== slideContent) && (
                <TodoView
                  currentDate={calcRelativeDate(baseDate, slideContent)}
                  onClickTodoCheck={handleChangeTodoComplete}
                  onClickTodo={handleClickTodoItem}
                  onClickAddTodo={addTodoDrawer.onOpen}
                ></TodoView>
              )}
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

type TodoViewProps = {
  currentDate: Date;
  onClickTodoCheck: (id: Todo["id"]) => void;
  onClickTodo: (id: Todo["id"]) => void;
  onClickAddTodo: () => void;
};
function TodoView(props: TodoViewProps) {
  const { currentDate, onClickTodoCheck, onClickTodo, onClickAddTodo } = props;
  const { todos } = useTodo(currentDate);
  /**
   * TODO: order api가 생기면 todo 상태를 따로 저장할 필요 없어짐
   */
  const { filterOption } = useSettingStore();
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

    onClickTodoCheck(todoId);
  };
  const handleClickTodoItem = (e: MouseEvent<HTMLElement>) => {
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);

    onClickTodo(todoId);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="overflow-y-scroll pb-4">
        <Reorder.Group
          axis="y"
          as="ul"
          values={orderedTodos}
          onReorder={setOrderedTodos}
          layoutScroll
          className="px-4 overflow-y-hidden overflow-x-hidden"
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
        <div className="px-4">
          <Button
            className="w-full mb-2"
            theme="primary"
            size="lg"
            onClick={onClickAddTodo}
          >
            + 할 일 추가하기
          </Button>
        </div>
      </div>
    </div>
  );
}
