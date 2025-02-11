import {
  Button,
  Collapsible,
  Dialog,
  Drawer,
  Portal,
} from "terra-design-system/react";
import { ChangeEvent, useState } from "react";
import { useDailyTodos } from "@/hooks/use-daily-todos";
import { useTodoDetailDrawerStore } from "@/stores/todo-detail-drawer";
import {
  CalendarIcon,
  ChevronDownIcon,
  NotepadTextIcon,
  PencilLineIcon,
  TagIcon,
} from "lucide-react";
import {
  changeDateOfTodo,
  delayNextDay,
  delayNextWeek,
  getDateFromTodo,
} from "@/utils/helper/todo";
import { useToast } from "@/contexts/toast";
import { useCurrentDateStore } from "@/stores/current-date";
import { cn } from "@/utils/cn";
import { isSameDay } from "date-fns";
import { CalendarCellWithLabel } from "../calendar/CalendarCellWithLabel";
import { CalendarContainer } from "../calendar/CalendarContainer";
import { CalendarGrid } from "../calendar/CalendarGrid";
import { CalendarHeader } from "../calendar/CalendarHeader";
import { CalendarRoot } from "../calendar/CalendarRoot";
import { sendModalCloseEvent, sendModalOpenEvent } from "@/utils/helper/app";
import { MenuItem } from "../MenuItem";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useCategories } from "@/hooks/category/use-categories";
import { Category } from "@/types/category";
import { getCategoryFgColor } from "@/utils/helper/category";
import { CategoryDialog } from "../Dialog/CategoryDialog";

export function TodoDetailDrawer() {
  const { currentTodo, changeCurrentTodo, onClose, isOpen } =
    useTodoDetailDrawerStore();
  const categoryModalHandler = useDisclosure();
  const { data: categories } = useCategories();
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

  const handleUpdateTitle = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleUpdateDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.currentTarget.value;
    if (currentTodo) {
      changeCurrentTodo({
        description: newDescription,
      });
      debouncedUpdateTodoById(currentTodo.id, {
        description: newDescription,
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

  const handleChangeCategory = (id: Category["id"] | null) => {
    const newCategory = categories.find((c) => c.id === id);
    if (newCategory) {
      changeCurrentTodo({
        categoryIdList: [newCategory.id],
      });
      debouncedUpdateTodoById(currentTodo.id, {
        categoryIdList: [newCategory.id],
      });
    } else {
      changeCurrentTodo({
        categoryIdList: [],
      });
      debouncedUpdateTodoById(currentTodo.id, {
        categoryIdList: [],
      });
    }
    categoryModalHandler.onClose();
  };

  const selectedCategory = categories.find(
    (c) => c.id === currentTodo.categoryIdList[0]
  );

  return (
    <Drawer.Root
      variant="bottom"
      open={isOpen}
      onInteractOutside={onClose}
      onEscapeKeyDown={onClose}
      trapFocus={false}
      preventScroll
      unmountOnExit
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            className="h-full min-h-96 rounded-t-lg pt-4"
            onFocus={(e) => e.preventDefault()}
          >
            <Drawer.Header className="p-0">
              <div className="flex flex-row border-y-2 border-boundary place-items-center px-4">
                <PencilLineIcon size={24} className="text-fg-placeholder" />
                <input
                  value={currentTodo.title}
                  className="bg-transparent text-fg-input h-12 px-2 py-2 focus:outline-none w-full"
                  onChange={handleUpdateTitle}
                  placeholder="할 일을 입력해주세요"
                  // enterKeyHint="done"
                />
              </div>
            </Drawer.Header>
            <Drawer.Body className="text-md p-0">
              <div className="flex flex-row border-b-2 border-boundary px-4 py-4 h-24">
                <div className="flex-0">
                  <NotepadTextIcon size={24} className="text-fg-placeholder" />
                </div>
                <textarea
                  value={currentTodo.description}
                  placeholder="설명"
                  onChange={handleUpdateDescription}
                  className="flex-1 bg-transparent placeholder:text-fg-placeholder text-fg-input px-2 rounded-none focus-visible:outline-none resize-none"
                />
              </div>
              <div className="border-b-2 border-boundary">
                <MenuItem
                  icon={<TagIcon className="text-gray-400" size={24} />}
                  type="button"
                  className="border-none"
                  onClick={categoryModalHandler.onOpen}
                >
                  {selectedCategory ? (
                    <div
                      className="text-md py-1/2 px-2 rounded-md"
                      style={{
                        backgroundColor: selectedCategory.color,
                        color: getCategoryFgColor(selectedCategory),
                      }}
                    >
                      {selectedCategory.name}
                    </div>
                  ) : (
                    "카테고리 선택"
                  )}{" "}
                  <span></span>
                </MenuItem>
                <CategoryDialog
                  open={categoryModalHandler.isOpen}
                  onInteractOutside={categoryModalHandler.onClose}
                  trapFocus={false}
                  categories={categories}
                  onChangeCategory={handleChangeCategory}
                />
              </div>
              <div className="border-b-2 border-boundary">
                <Collapsible.Root>
                  <Collapsible.Trigger className="flex place-items-center h-12">
                    <div className="flex flex-row gap-2">
                      <CalendarIcon size={24} className="text-fg-placeholder" />
                      <span>
                        {`${currentTodo.date.year}-${currentTodo.date.month
                          .toString()
                          .padStart(2, "0")}-${currentTodo.date.day
                          .toString()
                          .padStart(2, "0")}`}
                      </span>
                    </div>
                    <div className="flex-1" />
                    <ChevronDownIcon
                      size={24}
                      className="text-fg-placeholder"
                    />
                  </Collapsible.Trigger>
                  <Collapsible.Content className="border-t-0 py-2">
                    <div className="flex flex-row justify-start gap-3 w-full">
                      <h3 className="my-auto">미루기</h3>
                      <Button size="xs" onClick={handleClickDelayTomorrow}>
                        내일로
                      </Button>
                      <Button size="xs" onClick={handleClickDelayWeek}>
                        다음주로
                      </Button>
                      <Dialog.Root
                        onOpenChange={(details) => {
                          if (details.open) {
                            sendModalOpenEvent();
                          } else {
                            sendModalCloseEvent();
                          }
                        }}
                      >
                        <Dialog.Trigger asChild>
                          <Button size="xs" onClick={handleClickCalendarIcon}>
                            직접 선택
                          </Button>
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
                                                ) && "bg-layer-pressed"
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
                              <Button
                                theme="primary"
                                onClick={handleClickUpdateDateConfirm}
                              >
                                확인
                              </Button>
                              <Dialog.CloseTrigger asChild>
                                <Button variant="outline" theme="neutral">
                                  취소
                                </Button>
                              </Dialog.CloseTrigger>
                            </div>
                          </Dialog.Content>
                        </Dialog.Positioner>
                      </Dialog.Root>
                    </div>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            </Drawer.Body>
            <Drawer.Footer className="flex flex-row gap-3">
              <Button
                size="md"
                variant="ghost"
                theme="danger"
                onClick={handleClickDeleteCurrentTodo}
                className="flex-none"
              >
                삭제
              </Button>
              <Button
                theme="primary"
                variant="filled"
                onClick={onClose}
                className="flex-1"
              >
                확인
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
