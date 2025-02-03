import type { Category } from "@/types/category";
import { CategoryList } from "@/components/views/CategoryList";
import { ToastProvider } from "@/contexts/toast";
import { routerBack } from "@/utils/helper/app";
import { useNavigate } from "@remix-run/react";
import { ChevronLeft, PlusIcon, TagIcon, Trash2Icon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { FloatingButton } from "@/components/ui/FloatingButton";
import {
  Button,
  ColorPicker,
  Drawer,
  Input,
  Portal,
  ColorPickerValueChangeDetails,
  IconButton,
} from "terra-design-system/react";
import { cn } from "@/lib/utils";
import { getRandomHexColor } from "@/utils/color";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useCategories } from "@/hooks/category/use-categories";
import { useCreateCategory } from "@/hooks/category/use-create-category";
import { useDeleteCategory } from "@/hooks/category/use-delete-category";
import { useUpdateCategory } from "@/hooks/category/use-update-category";

const MAX_CATEGORY_LENGTH = 15;
export default function Category() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const createDrawerHandler = useDisclosure();
  const modifyDrawerHandler = useDisclosure();
  const [newCategory, setNewCategory] = useState<Omit<Category, "id">>({
    name: "",
    color: `${getRandomHexColor()}`,
  });
  const [modifyCategory, setModifyCategory] = useState<Category | undefined>();
  const handleGoBack = () => {
    routerBack(navigate);
  };

  const { data: categories } = useCategories();
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  const handleChangeNewCategoryName = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value.slice(0, 15);
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
  const handleClickAddCategory = async () => {
    setIsLoading(true);
    try {
      await createCategory(newCategory);
      createDrawerHandler.onClose();
      setNewCategory({
        name: "",
        color: getRandomHexColor(),
      });
    } catch (err) {
      /**
       * TODO: 에러에 따른 Toast 출력
       */
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickCategory = (id: Category["id"]) => {
    const category = categories.find((c) => c.id === id);
    if (!category) {
      return;
    }
    setModifyCategory({ ...category });
    modifyDrawerHandler.onOpen();
  };
  const handleChangeModifyCategoryName = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value.slice(0, 15);
    if (!modifyCategory) {
      return;
    }
    setModifyCategory({
      ...modifyCategory,
      name: name,
    });
  };
  const handleChangeModifyCategoryColor = (
    details: ColorPickerValueChangeDetails
  ) => {
    const color = details.value.toString("hex");
    if (!modifyCategory) {
      return;
    }
    setModifyCategory({
      ...modifyCategory,
      color: color,
    });
  };
  const handleClickModifyCategory = async () => {
    setIsLoading(true);
    try {
      if (!modifyCategory) {
        return;
      }
      await updateCategory(modifyCategory);
      modifyDrawerHandler.onClose();
      setModifyCategory(undefined);
    } catch (err) {
      /**
       * TODO: 에러에 따른 Toast 출력
       */
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickPlusCategoryButton = () => {
    setNewCategory({
      ...newCategory,
      color: getRandomHexColor(),
    });
    createDrawerHandler.onOpen();
  };

  const handleDeleteCategory = async () => {
    if (!modifyCategory) {
      return;
    }

    try {
      await deleteCategory({ id: modifyCategory.id });
    } catch (err) {
      /**
       * TODO: handle error
       */
    } finally {
      modifyDrawerHandler.onClose();
    }
  };

  return (
    <ToastProvider>
      <main className="h-screen w-full">
        <header className="h-header relative px-4 text-center border-b">
          <button className="absolute left-4 top-3" onClick={handleGoBack}>
            <ChevronLeft size={32} strokeWidth={1} />
          </button>
          <span className="text-xl my-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold">
            카테고리
          </span>
        </header>
        <div className="h-[calc(100%_-_64px)]">
          <CategoryList
            items={categories}
            onClickCategory={handleClickCategory}
          />
          <FloatingButton
            variant="filled"
            theme="primary"
            shape="round"
            onClick={handleClickPlusCategoryButton}
          >
            <PlusIcon size={32} />
          </FloatingButton>
          <Drawer.Root
            variant="bottom"
            open={createDrawerHandler.isOpen}
            onOpenChange={(e) => {
              createDrawerHandler.change(e.open);
            }}
          >
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content className="rounded-t-2xl">
                  <Drawer.Header>
                    <h2 className="text-xl">카테고리 추가</h2>
                  </Drawer.Header>
                  <Drawer.Body>
                    {/**
                     * 최대 15자 제한
                     */}
                    <div className="relative flex flex-row gap-2 place-items-center py-2">
                      <TagIcon size={20} className="text-gray-300 flex-none" />
                      <input
                        className="w-full flex-1 text-gray-800 focus:outline-none text-md"
                        onChange={handleChangeNewCategoryName}
                        value={newCategory.name}
                        placeholder="카테고리 이름 (최대 15자)"
                      />
                      <small className="text-gray-300">
                        {newCategory.name.length}/{MAX_CATEGORY_LENGTH}
                      </small>
                    </div>
                    <hr />
                    <ColorPicker.Root
                      value={newCategory.color}
                      onValueChange={handleChangeNewCategoryColor}
                    >
                      <ColorPicker.Context>
                        {(api) => (
                          <>
                            <ColorPicker.Control>
                              <ColorPicker.Trigger asChild>
                                <button className="w-full flex flex-row gap-2 place-items-center py-2 text-gray-800">
                                  <ColorPicker.Swatch
                                    className="rounded-full size-5"
                                    value={api.value}
                                  />
                                  <span className="select-none">
                                    {api.value.toString("hex")}
                                  </span>
                                </button>
                              </ColorPicker.Trigger>
                            </ColorPicker.Control>
                            <ColorPicker.Positioner>
                              <ColorPicker.Content>
                                <div className="trds-flex trds-flex-col trds-gap-3">
                                  <ColorPicker.Area>
                                    <ColorPicker.AreaBackground />
                                    <ColorPicker.AreaThumb />
                                  </ColorPicker.Area>
                                  <div className="trds-flex trds-flex-row trds-gap-3">
                                    <div
                                      className={cn(
                                        "trds-flex trds-flex-col trds-gap-2 trds-flex-1"
                                      )}
                                    >
                                      <ColorPicker.ChannelSlider channel="hue">
                                        <ColorPicker.ChannelSliderTrack />
                                        <ColorPicker.ChannelSliderThumb />
                                      </ColorPicker.ChannelSlider>
                                    </div>
                                  </div>
                                  <div className="trds-flex trds-gap-2 trds-flex-1">
                                    <ColorPicker.ChannelInput
                                      channel="hex"
                                      className="w-full"
                                      asChild
                                    >
                                      <Input />
                                    </ColorPicker.ChannelInput>
                                  </div>
                                  <div className="trds-flex trds-flex-col trds-gap-1.5">
                                    <ColorPicker.SwatchGroup>
                                      {presets.map((color, id) => (
                                        <ColorPicker.SwatchTrigger
                                          key={id}
                                          value={color}
                                        >
                                          <ColorPicker.Swatch value={color} />
                                        </ColorPicker.SwatchTrigger>
                                      ))}
                                    </ColorPicker.SwatchGroup>
                                  </div>
                                </div>
                              </ColorPicker.Content>
                            </ColorPicker.Positioner>
                          </>
                        )}
                      </ColorPicker.Context>
                    </ColorPicker.Root>
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Button
                      theme="primary"
                      className="w-full"
                      loading={isLoading}
                      onClick={handleClickAddCategory}
                    >
                      추가
                    </Button>
                  </Drawer.Footer>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
          <Drawer.Root
            variant="bottom"
            open={modifyDrawerHandler.isOpen}
            onOpenChange={(e) => {
              modifyDrawerHandler.change(e.open);
            }}
            trapFocus={false}
            unmountOnExit
          >
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content className="rounded-t-2xl">
                  <Drawer.Header>
                    <h2 className="text-xl h-9 leading-[36px]">
                      카테고리 수정
                    </h2>
                    <IconButton
                      onClick={handleDeleteCategory}
                      size="sm"
                      className="absolute right-4"
                    >
                      <Trash2Icon size={16} />
                    </IconButton>
                  </Drawer.Header>
                  <Drawer.Body>
                    <div className="relative flex flex-row gap-2 place-items-center py-2">
                      <TagIcon size={20} className="text-gray-300 flex-none" />
                      <input
                        className="w-full flex-1 text-gray-800 focus:outline-none text-md"
                        onChange={handleChangeModifyCategoryName}
                        value={modifyCategory?.name ?? ""}
                        placeholder="카테고리 이름 (최대 15자)"
                      />
                      <small className="text-gray-300">
                        {modifyCategory?.name.length}/{MAX_CATEGORY_LENGTH}
                      </small>
                    </div>
                    <hr />
                    <ColorPicker.Root
                      value={modifyCategory?.color ?? "#000000"}
                      onValueChange={handleChangeModifyCategoryColor}
                      unmountOnExit
                    >
                      <ColorPicker.Context>
                        {(api) => (
                          <>
                            <ColorPicker.Control>
                              <ColorPicker.Trigger asChild>
                                <button className="w-full flex flex-row gap-2 place-items-center py-2 text-gray-800">
                                  <ColorPicker.Swatch
                                    className="rounded-full size-5"
                                    value={api.value}
                                  />
                                  <span className="select-none">
                                    {api.value.toString("hex")}
                                  </span>
                                </button>
                              </ColorPicker.Trigger>
                            </ColorPicker.Control>
                            <ColorPicker.Positioner>
                              <ColorPicker.Content>
                                <div className="trds-flex trds-flex-col trds-gap-3">
                                  <ColorPicker.Area>
                                    <ColorPicker.AreaBackground />
                                    <ColorPicker.AreaThumb />
                                  </ColorPicker.Area>
                                  <div className="trds-flex trds-flex-row trds-gap-3">
                                    <div
                                      className={cn(
                                        "trds-flex trds-flex-col trds-gap-2 trds-flex-1"
                                      )}
                                    >
                                      <ColorPicker.ChannelSlider channel="hue">
                                        <ColorPicker.ChannelSliderTrack />
                                        <ColorPicker.ChannelSliderThumb />
                                      </ColorPicker.ChannelSlider>
                                    </div>
                                  </div>
                                  <div className="trds-flex trds-gap-2 trds-flex-1">
                                    <ColorPicker.ChannelInput
                                      channel="hex"
                                      className="w-full"
                                      asChild
                                    >
                                      <Input />
                                    </ColorPicker.ChannelInput>
                                  </div>
                                  <div className="trds-flex trds-flex-col trds-gap-1.5">
                                    <ColorPicker.SwatchGroup>
                                      {presets.map((color, id) => (
                                        <ColorPicker.SwatchTrigger
                                          key={id}
                                          value={color}
                                        >
                                          <ColorPicker.Swatch value={color} />
                                        </ColorPicker.SwatchTrigger>
                                      ))}
                                    </ColorPicker.SwatchGroup>
                                  </div>
                                </div>
                              </ColorPicker.Content>
                            </ColorPicker.Positioner>
                          </>
                        )}
                      </ColorPicker.Context>
                    </ColorPicker.Root>
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Button
                      theme="primary"
                      className="w-full"
                      loading={isLoading}
                      onClick={handleClickModifyCategory}
                    >
                      수정
                    </Button>
                  </Drawer.Footer>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </div>
      </main>
    </ToastProvider>
  );
}
// 💪 운동
const presets = [
  "hsl(10, 81%, 59%)",
  "hsl(60, 81%, 59%)",
  "hsl(100, 81%, 59%)",
  "hsl(175, 81%, 59%)",
  "hsl(190, 81%, 59%)",
  "hsl(205, 81%, 59%)",
  "hsl(220, 81%, 59%)",
  "hsl(250, 81%, 59%)",
  "hsl(280, 81%, 59%)",
  "hsl(350, 81%, 59%)",
];
