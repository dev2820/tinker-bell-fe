import { Button, Drawer, Portal } from "terra-design-system/react";
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
    setDescription("");
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
      categoryIdList: [],
    });
    addTodoDrawer.onClose();
    setTitle("");
    setDescription("");
  };
  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
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
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content className="h-full min-h-96 rounded-t-lg pt-4">
            <Drawer.Header className="h-full border-b">
              <h3 className="font-bold text-xl">할 일 추가</h3>
            </Drawer.Header>
            <Drawer.Body className="p-0 divide-y">
              <div className="relative">
                <input
                  value={title}
                  className="border-0 px-4 py-2 focus:outline-none w-full"
                  onChange={handleChangeTitle}
                  placeholder="할 일을 입력해주세요"
                  // enterKeyHint="done"
                />
              </div>
              <textarea
                value={description}
                className="border-0 px-4 focus:outline-none py-2 h-28"
                placeholder="설명"
                cols={5}
                onChange={handleChangeDescription}
              ></textarea>
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
