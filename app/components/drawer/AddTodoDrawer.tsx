import { Button, Drawer, Portal } from "terra-design-system/react";
import { TodoTitleTextarea } from "../todo/TodoTitleInput";
import { useAddTodoDrawerStore } from "@/stores/add-todo-drawer";
import { KeyboardEvent, ChangeEvent, useState } from "react";
import { useDailyTodos } from "@/hooks/use-daily-todos";
import { useCurrentDateStore } from "@/stores/current-date";

export function AddTodoDrawer() {
  const addTodoDrawer = useAddTodoDrawerStore();
  const { currentDate } = useCurrentDateStore();
  const [title, setTitle] = useState<string>("");

  const { createTodo } = useDailyTodos(currentDate);

  const handleCloseCreateTodo = () => {
    addTodoDrawer.onClose();
    setTitle("");
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.value === "\n") {
      setTitle("");
      return;
    }
    setTitle(e.currentTarget.value);
  };
  const handleKeydownTitle = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    setTitle(e.currentTarget.value);
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter") {
      if (title.length === 0) {
        return;
      }
      createTodo({
        title: title,
        date: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
          day: currentDate.getDate(),
        },
        order: 0,
      });

      setTitle("");
    }
  };
  const handleClickCreateTodo = async () => {
    createTodo({
      title: title,
      date: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
      },
      order: 0,
    });
    addTodoDrawer.onClose();
    setTitle("");
  };

  return (
    <Drawer.Root
      variant="bottom"
      open={addTodoDrawer.isOpen}
      onExitComplete={handleCloseCreateTodo}
      onInteractOutside={addTodoDrawer.onClose}
      onEscapeKeyDown={addTodoDrawer.onClose}
      // trapFocus={false}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content className="h-full min-h-96 rounded-t-lg pt-4">
            <Drawer.Header className="h-full">
              <div className="flex flex-row">
                <TodoTitleTextarea
                  value={title}
                  onChange={handleChangeTitle}
                  onKeyDown={handleKeydownTitle}
                  className="flex-1"
                  placeholder="할 일을 입력해주세요"
                  enterKeyHint="done"
                />
              </div>
            </Drawer.Header>
            <Drawer.Body></Drawer.Body>
            <Drawer.Footer>
              <Button
                variant="outline"
                className="mr-3"
                onClick={handleCloseCreateTodo}
              >
                닫기
              </Button>
              <Button theme="primary" onClick={handleClickCreateTodo}>
                확인
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
