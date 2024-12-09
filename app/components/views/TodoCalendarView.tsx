import { cn } from "@/lib/utils";
import { formatKoreanDate, isSameDay } from "@/utils/date-time";
import { ComponentProps, useState } from "react";
import { Toast } from "terra-design-system/react";
import { useToast } from "@/contexts/toast";
import { CalendarGrid } from "../calendar/CalendarGrid";
import { useMonthlyTodos } from "@/hooks/use-monthly-todos";
import { CalendarCellWithLabel } from "../calendar/CalendarCellWithLabel";
import { useCurrentDateStore } from "@/stores/current-date";
import { CalendarRoot } from "../calendar/CalendarRoot";
import { CalendarContainer } from "../calendar/CalendarContainer";
import { CalendarHeader } from "../calendar/CalendarHeader";
import "swiper/css";
import "swiper/css/virtual";
import { DailyTodoList } from "../todo/DailyTodoList";

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
          <DailyTodoList
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
