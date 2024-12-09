import { cn } from "@/lib/utils";
import { formatKoreanDate, isSameDay } from "@/utils/date-time";
import { MouseEvent, ChangeEvent, ComponentProps, useState } from "react";
import { Toast } from "terra-design-system/react";
import { useToast } from "@/contexts/toast";
import { CalendarGrid } from "../calendar/CalendarGrid";
import { AnimatePresence, Reorder } from "framer-motion";
import { TodoDraggableItem } from "../todo/TodoDraggableItem";
import { useDailyTodos } from "@/hooks/use-daily-todos";
import { useTodoDetailDrawerStore } from "@/stores/todo-detail-drawer";
import { useMonthlyTodos } from "@/hooks/use-monthly-todos";
import { CalendarCellWithLabel } from "../calendar/CalendarCellWithLabel";
import { useCurrentDateStore } from "@/stores/current-date";
import { CalendarRoot } from "../calendar/CalendarRoot";
import { CalendarContainer } from "../calendar/CalendarContainer";
import { CalendarHeader } from "../calendar/CalendarHeader";
import { vibrateShort } from "@/utils/device/vibrate";
import "swiper/css";
import "swiper/css/virtual";

type TodoCalendarViewProps = ComponentProps<"div">;
export function TodoCalendarView(props: TodoCalendarViewProps) {
  const { className, ...rest } = props;
  const [baseDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const currentDateStore = useCurrentDateStore();
  const [shownDate, setShownDate] = useState<Date>(baseDate);
  const { incompletedTodos, completedTodos } = useMonthlyTodos(
    shownDate.getFullYear(),
    shownDate.getMonth()
  );
  const totalTodoMap = [...incompletedTodos, ...completedTodos]?.reduce(
    (map, todo) => {
      const key = `${todo.date.month}-${todo.date.day}`;
      const [prevDone, prevTotal] = map.get(key) ?? [0, 0];
      map.set(key, [prevDone + (todo.isCompleted ? 1 : 0), prevTotal + 1]);

      return map;
    },
    new Map<string, [number, number]>()
  );
  const { toaster } = useToast();

  const handleSelectDate = (newDate: Date) => {
    setSelectedDate(newDate);
    currentDateStore.changeCurrentDate(newDate);
  };
  const handleChangeShownDate = (year: number, month: number) => {
    //
    setShownDate(new Date(year, month));
  };
  return (
    <div className={cn(className)} {...rest}>
      <div className="h-[calc(100%_-_56px)] w-full">
        <CalendarRoot
          baseDate={baseDate}
          onSelectDate={handleSelectDate}
          onChangeShownDate={handleChangeShownDate}
        >
          <CalendarHeader />
          <CalendarContainer className="px-4">
            {(year, month) => (
              <CalendarGrid className="" year={year} month={month}>
                {(days) => (
                  <>
                    {days.map(([year, month, day]) => (
                      <CalendarCellWithLabel
                        key={`${year}-${month}-${day}`}
                        year={year}
                        month={month}
                        day={day}
                        className={cn(
                          "w-full h-10",
                          isSameDay(new Date(year, month, day), selectedDate) &&
                            "bg-gray-200"
                        )}
                        data-year={year}
                        data-month={month}
                        data-day={day}
                        isOutOfMonth={month !== shownDate.getMonth()}
                        labelText={totalTodoMap
                          ?.get(`${month + 1}-${day}`)
                          ?.join("/")}
                      />
                    ))}
                  </>
                )}
              </CalendarGrid>
            )}
          </CalendarContainer>
        </CalendarRoot>
        <section className="h-[calc(100%_-_324px)] pt-4">
          <h3 className="h-[40px] px-4 pb-4 text-lg">
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
  const {
    completedTodos,
    incompletedTodos,
    findTodoById,
    toggleTodoById,
    reorderCompletedTodos,
    reorderIncompletedTodos,
  } = useDailyTodos(currentDate);
  const { toaster, showToast } = useToast();

  const todoDetailDrawer = useTodoDetailDrawerStore();

  const handleChangeComplete = (e: ChangeEvent<HTMLElement>) => {
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);
    const todo = findTodoById(todoId);
    if (!todo) {
      return;
    }
    if (todo.isCompleted) {
      showToast({
        description: `작업 완료! 🥳`,
      });
    }
    toggleTodoById(todoId);
    vibrateShort();
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
    <div className={cn("overflow-y-auto", className)}>
      <div className="overflow-y-scroll pb-8 px-4">
        <Reorder.Group
          axis="y"
          as="ul"
          values={incompletedTodos}
          onReorder={reorderIncompletedTodos}
          layoutScroll
          className="overflow-y-hidden overflow-x-hidden"
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
          className="overflow-y-hidden overflow-x-hidden"
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
