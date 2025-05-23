import { Button, Drawer, Portal } from "terra-design-system/react";
import { useAddTodoDrawerStore } from "@/stores/add-todo-drawer";
import { ChangeEvent, useState } from "react";
import { useDailyTodos } from "@/hooks/use-daily-todos";
import { useCurrentDateStore } from "@/stores/current-date";
import { SendHorizonalIcon, TagIcon } from "lucide-react";
import { MenuItem } from "../MenuItem";
import { useCategories } from "@/hooks/category/use-categories";
import { Category } from "@/types/category";
import { useDisclosure } from "@/hooks/use-disclosure";
import { CategoryItem } from "../category/CategoryItem";
import { CategoryDialog } from "../Dialog/CategoryDialog";

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
    setCategoryId(-1);
  };
  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.currentTarget.value);
  };
  const handleChangeCategory = (id: Category["id"] | null) => {
    if (id === null) {
      setCategoryId(-1);
    } else {
      setCategoryId(id);
    }
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
              <Drawer.Header className="h-full border-b border-boundary">
                <h3 className="font-bold text-xl">할 일 추가</h3>
              </Drawer.Header>
              <Drawer.Body className="p-0">
                <div className="relative">
                  <input
                    value={title}
                    className="bg-transparent border-b border-boundary h-12 px-4 py-2 focus:outline-none w-full"
                    onChange={handleChangeTitle}
                    placeholder="할 일을 입력해주세요"
                    // enterKeyHint="done"
                  />
                </div>
                <textarea
                  value={description}
                  className="bg-transparent border-b border-boundary px-4 focus:outline-none py-2 h-28"
                  placeholder="설명"
                  cols={5}
                  onChange={handleChangeDescription}
                ></textarea>

                <MenuItem
                  icon={<TagIcon className="text-gray-400" size={16} />}
                  type="button"
                  className="border-b border-boundary"
                  onClick={categoryModalHandler.onOpen}
                >
                  {selectedCategory ? (
                    <CategoryItem category={selectedCategory} />
                  ) : (
                    "카테고리 선택"
                  )}
                </MenuItem>
                <CategoryDialog
                  open={categoryModalHandler.isOpen}
                  onInteractOutside={categoryModalHandler.onClose}
                  trapFocus={false}
                  categories={categories}
                  onChangeCategory={handleChangeCategory}
                />
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
