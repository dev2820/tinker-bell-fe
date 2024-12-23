import { Button, Drawer, Portal, Textarea } from "terra-design-system/react";
import { TodoTitleTextarea } from "../todo/TodoTitleTextarea";
import { useAddTodoDrawerStore } from "@/stores/add-todo-drawer";
import { ChangeEvent, useState } from "react";
import { useDailyTodos } from "@/hooks/use-daily-todos";
import { useCurrentDateStore } from "@/stores/current-date";
import { SendHorizonalIcon } from "lucide-react";

export function AddTodoDrawer() {
  const addTodoDrawer = useAddTodoDrawerStore();
  const { currentDate } = useCurrentDateStore();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

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

  const handleClickCreateTodo = async () => {
    createTodo({
      title: title,
      description: description,
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

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.currentTarget.value);
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
              <TodoTitleTextarea
                value={title}
                onChange={handleChangeTitle}
                placeholder="할 일을 입력해주세요"
                enterKeyHint="done"
              />
            </Drawer.Header>
            <Drawer.Body>
              <Textarea
                value={description}
                placeholder="설명"
                onChange={handleChangeDescription}
              ></Textarea>
            </Drawer.Body>
            <Drawer.Footer>
              <Button
                variant="ghost"
                className="mr-3"
                onClick={handleCloseCreateTodo}
              >
                닫기
              </Button>
              <Button
                variant="ghost"
                theme="primary"
                onClick={handleClickCreateTodo}
              >
                <SendHorizonalIcon size={24} />
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
