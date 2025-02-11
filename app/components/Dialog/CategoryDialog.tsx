import { Dialog, DialogProps } from "terra-design-system/react";
import { CategoryList } from "../views/CategoryList";
import { Category } from "@/types/category";
import { CategoryItem } from "../category/CategoryItem";

type CategoryDialogProps = DialogProps["Root"] & {
  categories: Category[];
  onChangeCategory?: (categoryId: Category["id"] | null) => void;
};
export function CategoryDialog(props: CategoryDialogProps) {
  const { categories, onChangeCategory, ...rest } = props;
  return (
    <Dialog.Root {...rest}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content className="mx-4 w-full max-w-md p-4">
          <Dialog.Title>카테고리 선택</Dialog.Title>
          <CategoryList items={categories} onClickCategory={onChangeCategory} />
          <button
            className="h-12 w-full px-4 hover:bg-layer-hover"
            type="button"
            onClick={() => onChangeCategory?.(null)}
          >
            <CategoryItem
              category={{
                id: -1,
                name: "없음",
                color: "#ffffff",
              }}
              className="h-full w-full"
            ></CategoryItem>
          </button>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
