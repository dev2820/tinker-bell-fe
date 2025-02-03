import { Button, Dialog, Drawer, Portal } from "terra-design-system/react";
import { useAddTodoDrawerStore } from "@/stores/add-todo-drawer";
import { ChangeEvent, useState } from "react";
import { useDailyTodos } from "@/hooks/use-daily-todos";
import { useCurrentDateStore } from "@/stores/current-date";
import { SendHorizonalIcon, TagIcon } from "lucide-react";
import { MenuItem } from "../MenuItem";
import { CategoryList } from "../views/CategoryList";
import { useCategories } from "@/hooks/use-categories";
import { Category } from "@/types/category";
import { useDisclosure } from "@/hooks/use-disclosure";
import { CategoryItem } from "../category/CategoryItem";

export function AddTodoDrawer() {
  const addTodoDrawer = useAddTodoDrawerStore();
  const categoryModalHandler = useDisclosure();
  const { currentDate } = useCurrentDateStore();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>(-1);
  const { data: categories } = useCategories();
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
      categoryIdList: categoryId >= 0 ? [categoryId] : [],
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
  const handleChangeCategory = (id: Category["id"]) => {
    setCategoryId(id);
    categoryModalHandler.onClose();
  };
  const handleClickDeleteCategory = () => {
    setCategoryId(-1);
    categoryModalHandler.onClose();
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);
  return (
    <>
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
              <Drawer.Body className="p-0">
                <div className="relative">
                  <input
                    value={title}
                    className="border-b h-12 px-4 py-2 focus:outline-none w-full"
                    onChange={handleChangeTitle}
                    placeholder="할 일을 입력해주세요"
                    // enterKeyHint="done"
                  />
                </div>
                <textarea
                  value={description}
                  className="border-b px-4 focus:outline-none py-2 h-28"
                  placeholder="설명"
                  cols={5}
                  onChange={handleChangeDescription}
                ></textarea>

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
                          category={{ id: -1, name: "없음", color: "#ffffff" }}
                          className="h-full w-full"
                        ></CategoryItem>
                      </button>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Dialog.Root>
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
    </>
  );
}
