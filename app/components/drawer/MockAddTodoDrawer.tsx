import { Button, Drawer, Portal, Textarea } from "terra-design-system/react";
import { TodoTitleTextarea } from "../todo/TodoTitleTextarea";
import { useAddTodoDrawerStore } from "@/stores/add-todo-drawer";
import { ChangeEvent, useState } from "react";
import { useCurrentDateStore } from "@/stores/current-date";
import { useMockTodo } from "@/hooks/use-mock-todo";

export function MockAddTodoDrawer() {
  const addTodoDrawer = useAddTodoDrawerStore();
  const { currentDate } = useCurrentDateStore();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { createTodo } = useMockTodo(currentDate);

  const handleCloseCreateTodo = () => {
    addTodoDrawer.onClose();
    setTitle("");
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
              <div className="flex flex-row">
                <TodoTitleTextarea
                  value={title}
                  onChange={handleChangeTitle}
                  className="flex-1"
                  placeholder="할 일을 입력해주세요"
                  enterKeyHint="done"
                />
              </div>
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
