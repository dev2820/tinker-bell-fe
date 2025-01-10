import type { Category } from "@/types/category";
import { CategoryList } from "@/components/views/CategoryList";
import { ToastProvider } from "@/contexts/toast";
import { createCategory, fetchCategories } from "@/utils/api/category";
import { routerBack } from "@/utils/helper/app";
import { useNavigate } from "@remix-run/react";
import { ChevronLeft, PlusIcon, TagIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { FloatingButton } from "@/components/ui/FloatingButton";
import {
  Button,
  ColorPicker,
  Drawer,
  Input,
  Portal,
  ColorPickerValueChangeDetails,
} from "terra-design-system/react";
import { cn } from "@/lib/utils";
import { getRandomHexColor } from "@/utils/color";
import { useDisclosure } from "@/hooks/use-disclosure";

const MAX_CATEGORY_LENGTH = 15;
export default function Category() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const drawerHandler = useDisclosure();
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryColor, setCategoryColor] = useState<string>(
    getRandomHexColor()
  );
  const handleGoBack = () => {
    routerBack(navigate);
  };

  const [categories, setCategories] = useState<Category[]>([]);

  async function updateCategories() {
    const categories = await fetchCategories();
    setCategories(categories);
  }

  useEffect(() => {
    updateCategories();
  }, []);

  const handleChangeCategory = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.currentTarget.value.slice(0, 15));
  };
  const handleChangeColor = (details: ColorPickerValueChangeDetails) => {
    setCategoryColor(details.value.toString("hex"));
  };
  const handleClickAddCategory = async () => {
    setIsCreating(true);
    try {
      await createCategory({
        name: categoryName,
        color: categoryColor,
      });
      drawerHandler.onClose();
    } catch (err) {
      /**
       * TODO: 에러에 따른 Toast 출력
       */
    } finally {
      setIsCreating(false);
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
        <div className="h-[calc(100%_-_64px)] px-4 py-4">
          <CategoryList items={categories} />
          <Drawer.Root
            variant="bottom"
            open={drawerHandler.isOpen}
            onOpenChange={(e) => {
              drawerHandler.change(e.open);
            }}
          >
            <Drawer.Trigger asChild>
              <FloatingButton variant="filled" theme="primary" shape="round">
                <PlusIcon size={32} />
              </FloatingButton>
            </Drawer.Trigger>
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
                        onChange={handleChangeCategory}
                        value={categoryName}
                        placeholder="카테고리 이름 (최대 15자)"
                      />
                      <small className="text-gray-300">
                        {categoryName.length}/{MAX_CATEGORY_LENGTH}
                      </small>
                    </div>
                    <hr />
                    <ColorPicker.Root
                      value={categoryColor}
                      onValueChange={handleChangeColor}
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
                      loading={isCreating}
                      onClick={handleClickAddCategory}
                    >
                      추가
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
