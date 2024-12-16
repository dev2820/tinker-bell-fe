import { useToast } from "@/contexts/toast";
import { useDailyTodos } from "@/hooks/use-daily-todos";
import { cn } from "@/lib/utils";
import { useTodoDetailDrawerStore } from "@/stores/todo-detail-drawer";
import { vibrateShort } from "@/utils/device/vibrate";
import { Toast } from "terra-design-system/react";
import { Reorder, AnimatePresence } from "framer-motion";
import { ChangeEvent, MouseEvent } from "react";
import { TodoDraggableItem } from "./TodoDraggableItem";

type DailyTodoListProps = {
  className?: string;
  currentDate: Date;
};
export function DailyTodoList(props: DailyTodoListProps) {
  const { currentDate, className } = props;
  const {
    isLoading,
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
    if (!todo.isCompleted) {
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

  const nothingTodo =
    incompletedTodos.length === 0 && completedTodos.length === 0;

  if (isLoading) {
    return null;
  }
  if (nothingTodo) {
    return (
      <div className={cn("flex flex-col justify-center", className)}>
        <p className="text-center text-lg text-gray-300 py-8">
          +버튼을 눌러 할 일을 추가해주세요
        </p>
      </div>
    );
  }
  return (
    <div className={cn("overflow-y-auto", className)}>
      <div className="overflow-y-scroll pb-8">
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
                className="w-[calc(100%_-_32px)] mx-auto"
                onChangeComplete={handleChangeComplete}
                onClickTodo={handleClickTodoItem}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
        {!nothingTodo && <hr className="w-[calc(100%_-_32px)] mx-auto my-8" />}
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
                className="w-[calc(100%_-_32px)] mx-auto"
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
