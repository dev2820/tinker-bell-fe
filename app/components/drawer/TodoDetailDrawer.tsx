import {
  Button,
  Dialog,
  Drawer,
  IconButton,
  Portal,
  Textarea,
} from "terra-design-system/react";
import { TodoTitleTextarea } from "../todo/TodoTitleTextarea";
import { ChangeEvent, useState } from "react";
import { useDailyTodos } from "@/hooks/use-daily-todos";
import { useTodoDetailDrawerStore } from "@/stores/todo-detail-drawer";
import { CalendarIcon, TagIcon, Trash2Icon } from "lucide-react";
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
import { sendModalCloseEvent, sendModalOpenEvent } from "@/utils/helper/app";
import { MenuItem } from "../MenuItem";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useCategories } from "@/hooks/category/use-categories";
import { CategoryItem } from "../category/CategoryItem";
import { CategoryList } from "../views/CategoryList";
import { Category } from "@/types/category";

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

  const handleChangeCategory = (id: Category["id"]) => {
    const newCategory = categories.find((c) => c.id === id);
    if (newCategory) {
      changeCurrentTodo({
        categoryIdList: [newCategory.id],
      });
      debouncedUpdateTodoById(currentTodo.id, {
        categoryIdList: [newCategory.id],
      });
    }
    categoryModalHandler.onClose();
  };
  const handleClickDeleteCategory = () => {
    changeCurrentTodo({
      categoryIdList: [],
    });
    debouncedUpdateTodoById(currentTodo.id, {
      categoryIdList: [],
    });
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
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            className="h-full min-h-96 rounded-t-lg pt-4"
            onFocus={(e) => e.preventDefault()}
          >
            <Drawer.Header>
              <div className="flex flex-row place-items-start h-auto">
                <TodoTitleTextarea
                  value={currentTodo.title}
                  onChange={handleUpdateTitle}
                  className="w-full min-w-0 text-md"
                  placeholder="할 일을 입력해주세요"
                />
                <IconButton
                  size="md"
                  variant="ghost"
                  onClick={handleClickDeleteCurrentTodo}
                  className="flex-none"
                >
                  <Trash2Icon size={24} />
                </IconButton>
              </div>
            </Drawer.Header>
            <Drawer.Body className="text-md">
              <Textarea
                value={currentTodo.description}
                placeholder="설명"
                onChange={handleUpdateDescription}
                className="mb-4"
              ></Textarea>
              <section>
                <div className="flex flex-row gap-3 place-items-center mb-2 text-gray-800">
                  <CalendarIcon size={24} />
                  <span>
                    {`${currentTodo.date.year}-${currentTodo.date.month
                      .toString()
                      .padStart(2, "0")}-${currentTodo.date.day
                      .toString()
                      .padStart(2, "0")}`}
                  </span>
                </div>
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
                <div className="mt-2">
                  <MenuItem
                    icon={<TagIcon className="text-gray-400" size={16} />}
                    type="button"
                    className="text-gray-800 border-b"
                    onClick={categoryModalHandler.onOpen}
                  >
                    {selectedCategory ? (
                      <CategoryItem category={selectedCategory} />
                    ) : (
                      "카테고리 선택"
                    )}
                  </MenuItem>
                  <Dialog.Root
                    open={categoryModalHandler.isOpen}
                    onInteractOutside={categoryModalHandler.onClose}
                  >
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content className="mx-4 w-full max-w-md p-4">
                        <Dialog.Title>카테고리 선택</Dialog.Title>
                        <CategoryList
                          items={categories}
                          onClickCategory={handleChangeCategory}
                        />
                        <button
                          className="h-12 w-full"
                          type="button"
                          onClick={handleClickDeleteCategory}
                        >
                          <CategoryItem
                            category={{
                              id: -1,
                              name: "없음",
                              color: "#ffffff",
                            }}
                            className="h-full w-full"
                          ></CategoryItem>
                        </button>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Dialog.Root>
                </div>
              </section>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={onClose}>
                닫기
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
