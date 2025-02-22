import {
  Dialog,
  DialogProps,
  Button,
  ColorPickerValueChangeDetails,
} from "terra-design-system/react";
import { useCategories } from "@/hooks/category/use-categories";
import { Category } from "@/types/category";
import { ChangeEvent, useState } from "react";
import { ColorPicker } from "../ColorPicker";
import { useDeleteCategory } from "@/hooks/category/use-delete-category";
import { useUpdateCategory } from "@/hooks/category/use-update-category";
import { TagIcon } from "lucide-react";
import { CategoryItem } from "../category/CategoryItem";
import { useDisclosure } from "@/hooks/use-disclosure";
import { getRandomHexColor } from "@/utils/color";
import { useCreateCategory } from "@/hooks/category/use-create-category";

const MAX_CATEGORY_LENGTH = 15;

type CategoryManageDialogProps = DialogProps["Root"];
export function CategoryManageDialog(props: CategoryManageDialogProps) {
  const { children, ...rest } = props;

  const categoryDetailHandler = useDisclosure();
  const categoryCreateHandler = useDisclosure();
  const { data: categories } = useCategories();
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: createCategory } = useCreateCategory();
  const [id, setId] = useState<number>(-1);
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [newCategory, setNewCategory] = useState<Category>({
    id: -1,
    name: "",
    color: "#000000",
  });
  const handleChangeColor = (details: ColorPickerValueChangeDetails) => {
    const color = details.value.toString("hex");
    setColor(color);
  };

  const handleOpenCategoryDetail = (category: Category) => {
    setId(category.id);
    setName(category.name);
    setColor(category.color);
    categoryDetailHandler.onOpen();
  };
  const handleChangeName = (evt: ChangeEvent<HTMLInputElement>) => {
    const name = evt.target.value;
    setName(name);
  };
  const handleChangeNewCategoryName = (evt: ChangeEvent<HTMLInputElement>) => {
    const name = evt.target.value;
    setNewCategory({
      ...newCategory,
      name: name,
    });
  };
  const handleChangeNewCategoryColor = (
    details: ColorPickerValueChangeDetails
  ) => {
    const color = details.value.toString("hex");
    setNewCategory({
      ...newCategory,
      color: color,
    });
  };
  const handleUpdateCategory = () => {
    updateCategory({
      id,
      name,
      color,
    });

    categoryDetailHandler.onClose();
  };
  const handleDelete = (id: Category["id"]) => {
    /**(
     * 삭제
    ) */
    deleteCategory({ id });
  };

  const handleClickAddCategory = () => {
    setNewCategory({
      id: -1,
      name: "",
      color: getRandomHexColor(),
    });
    categoryCreateHandler.onOpen();
  };
  const handleAddCategory = () => {
    createCategory({
      name: newCategory.name,
      color: newCategory.color,
    });
    categoryCreateHandler.onClose();
  };
  return (
    <Dialog.Root {...rest}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content className="mx-4 h-96 w-full flex flex-col max-w-md p-4">
          <Dialog.Title>카테고리</Dialog.Title>
          <ul className="flex-1 overflow-auto">
            {categories.map((c) => (
              <li key={c.id} className="h-10 flex flex-row gap-2">
                <button
                  className="flex-1 hover:bg-layer-hover active:bg-layer-pressed transition-colors duration-300 rounded-md px-4"
                  onClick={() => handleOpenCategoryDetail(c)}
                >
                  <CategoryItem category={c} />
                </button>
                <Button
                  size="sm"
                  theme="danger"
                  variant="ghost"
                  className="flex-none"
                  onClick={() => handleDelete(c.id)}
                >
                  삭제
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex flex-row-reverse gap-2 mt-4">
            <Button
              className="flex-1"
              variant="filled"
              theme="primary"
              onClick={handleClickAddCategory}
            >
              추가
            </Button>
            <Dialog.CloseTrigger asChild>
              <Button variant="outline" theme="neutral" className="flex-1">
                닫기
              </Button>
            </Dialog.CloseTrigger>
          </div>
          <Dialog.Root open={categoryDetailHandler.isOpen} trapFocus={false}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content className="p-4 max-w-[300px] w-full">
                <div className="border-b relative flex flex-row gap-2 place-items-center pb-1">
                  <TagIcon size={20} className="text-gray-300 flex-none" />
                  <input
                    className="w-full flex-1 focus:outline-none text-md"
                    onChange={handleChangeName}
                    value={name ?? ""}
                    placeholder="카테고리 이름 (최대 15자)"
                  />
                  <small className="text-gray-300">
                    {name.length}/{MAX_CATEGORY_LENGTH}
                  </small>
                </div>
                <ColorPicker
                  className="mt-1"
                  value={color}
                  onValueChange={handleChangeColor}
                />
                <div className="flex flex-row-reverse mt-4 gap-2">
                  <Button
                    className="flex-1"
                    variant="filled"
                    theme="primary"
                    onClick={handleUpdateCategory}
                  >
                    확인
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    theme="neutral"
                    onClick={categoryDetailHandler.onClose}
                  >
                    취소
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
          <Dialog.Root open={categoryCreateHandler.isOpen} trapFocus={false}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content className="p-4 max-w-[300px] w-full">
                <div className="border-b relative flex flex-row gap-2 place-items-center pb-1">
                  <TagIcon size={20} className="text-gray-300 flex-none" />
                  <input
                    className="w-full flex-1 focus:outline-none text-md"
                    onChange={handleChangeNewCategoryName}
                    value={newCategory.name}
                    placeholder="카테고리 이름 (최대 15자)"
                  />
                  <small className="text-gray-300">
                    {name.length}/{MAX_CATEGORY_LENGTH}
                  </small>
                </div>
                <ColorPicker
                  className="mt-1"
                  value={newCategory.color}
                  onValueChange={handleChangeNewCategoryColor}
                />
                <div className="flex flex-row-reverse mt-4 gap-2">
                  <Button
                    className="flex-1"
                    variant="filled"
                    theme="primary"
                    onClick={handleAddCategory}
                  >
                    확인
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    theme="neutral"
                    onClick={categoryCreateHandler.onClose}
                  >
                    취소
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
