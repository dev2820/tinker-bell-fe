import {
  Button,
  Dialog,
  Drawer,
  IconButton,
  Portal,
} from "terra-design-system/react";
import { TodoTitleTextarea } from "../todo/TodoTitleInput";
import { ChangeEvent, useState } from "react";
import { useDailyTodos } from "@/hooks/use-daily-todos";
import { useTodoDetailDrawerStore } from "@/stores/todo-detail-drawer";
import { CalendarIcon, Trash2Icon } from "lucide-react";
import {
  changeDateOfTodo,
  delayNextDay,
  delayNextWeek,
  getDateFromTodo,
} from "@/utils/helper/todo";
import { useToast } from "@/contexts/toast";
import { useCurrentDateStore } from "@/stores/current-date";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { CalendarCellWithLabel } from "../calendar/CalendarCellWithLabel";
import { CalendarContainer } from "../calendar/CalendarContainer";
import { CalendarGrid } from "../calendar/CalendarGrid";
import { CalendarHeader } from "../calendar/CalendarHeader";
import { CalendarRoot } from "../calendar/CalendarRoot";

export function TodoDetailDrawer() {
  const { currentTodo, changeCurrentTodo, onClose, isOpen } =
    useTodoDetailDrawerStore();
  const { currentDate } = useCurrentDateStore();
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [shownDate, setShownDate] = useState<Date>(currentDate);
  const { deleteTodoById, debouncedUpdateTodoById, updateTodoById } =
    useDailyTodos(getDateFromTodo(currentTodo));
  const { showToast } = useToast();
  const handleClickDeleteCurrentTodo = () => {
    // show todo details
    if (currentTodo) {
      deleteTodoById(currentTodo.id);
      onClose();
      showToast({
        description: "삭제 완료 🗑️",
      });
    }
  };

  const handleUpdateTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.currentTarget.value;
    if (currentTodo) {
      changeCurrentTodo({
        title: newTitle,
      });
      debouncedUpdateTodoById(currentTodo.id, {
        title: newTitle,
      });
    }
  };

  const handleClickDelayTomorrow = () => {
    const delayedTodo = delayNextDay(currentTodo);
    changeCurrentTodo(delayedTodo);
    updateTodoById(delayedTodo.id, { date: delayedTodo.date });
    onClose();
  };

  const handleClickDelayWeek = () => {
    const delayedTodo = delayNextWeek(currentTodo);
    changeCurrentTodo(delayedTodo);
    updateTodoById(delayedTodo.id, { date: delayedTodo.date });
    onClose();
  };

  const handleSelectDate = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const handleClickUpdateDateConfirm = () => {
    const changedTodo = changeDateOfTodo(currentTodo, selectedDate);
    if (currentTodo) {
      changeCurrentTodo(changedTodo);
      updateTodoById(changedTodo.id, { date: changedTodo.date });
      onClose();
    }
  };

  const handleClickCalendarIcon = () => {
    setSelectedDate(getDateFromTodo(currentTodo));
  };

  const handleChangeShownDate = (year: number, month: number) => {
    setShownDate(new Date(year, month));
  };

  return (
    <Drawer.Root
      variant="bottom"
      open={isOpen}
      onInteractOutside={onClose}
      onEscapeKeyDown={onClose}
      trapFocus={false}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            className="h-full min-h-96 rounded-t-lg pt-4"
            onFocus={(e) => e.preventDefault()}
          >
            <Drawer.Header>
              <Drawer.Title className="w-full">
                <div className="flex flex-row place-items-start h-auto">
                  <TodoTitleTextarea
                    value={currentTodo.title}
                    onChange={handleUpdateTitle}
                    className="w-full h-8 min-w-0"
                    placeholder="할 일을 입력해주세요"
                  />
                  <IconButton
                    size="md"
                    variant="ghost"
                    onClick={handleClickDeleteCurrentTodo}
                    className="flex-none -mt-1.5"
                  >
                    <Trash2Icon size={24} />
                  </IconButton>
                </div>
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Description>
              <section className="flex flex-row place-items-center gap-3 px-4">
                <CalendarIcon size={24} />
                <Dialog.Root>
                  {`${currentTodo.date.year}-${currentTodo.date.month
                    .toString()
                    .padStart(2, "0")}-${currentTodo.date.day
                    .toString()
                    .padStart(2, "0")}`}
                  <Dialog.Trigger asChild>
                    <IconButton size="sm" onClick={handleClickCalendarIcon}>
                      <CalendarIcon size={24} />
                    </IconButton>
                  </Dialog.Trigger>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content className="w-4/5 min-w-92 h-112 py-6 flex flex-col">
                      <Dialog.Title className="text-center flex-none px-4">
                        날짜 변경
                      </Dialog.Title>
                      <Dialog.Description className="flex-1">
                        <CalendarRoot
                          baseDate={currentDate}
                          onSelectDate={handleSelectDate}
                          onChangeShownDate={handleChangeShownDate}
                        >
                          <CalendarHeader />
                          <CalendarContainer className="px-4">
                            {(year, month) => (
                              <CalendarGrid
                                className=""
                                year={year}
                                month={month}
                              >
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
                                          isSameDay(
                                            new Date(year, month, day),
                                            selectedDate
                                          ) && "bg-gray-200"
                                        )}
                                        data-year={year}
                                        data-month={month}
                                        data-day={day}
                                        isOutOfMonth={
                                          month !== shownDate.getMonth()
                                        }
                                      />
                                    ))}
                                  </>
                                )}
                              </CalendarGrid>
                            )}
                          </CalendarContainer>
                        </CalendarRoot>
                      </Dialog.Description>
                      <div className="flex flex-row-reverse flex-none px-4 gap-3">
                        <Dialog.CloseTrigger asChild>
                          <Button
                            theme="primary"
                            onClick={handleClickUpdateDateConfirm}
                          >
                            확인
                          </Button>
                        </Dialog.CloseTrigger>
                        <Dialog.CloseTrigger asChild>
                          <Button variant="outline" theme="neutral">
                            취소
                          </Button>
                        </Dialog.CloseTrigger>
                      </div>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Dialog.Root>
                <Button size="sm" onClick={handleClickDelayTomorrow}>
                  내일로
                </Button>
                <Button size="sm" onClick={handleClickDelayWeek}>
                  다음주로
                </Button>
              </section>
            </Drawer.Description>
            <Drawer.Footer>
              <Button onClick={onClose}>닫기</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
