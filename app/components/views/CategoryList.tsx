import { cn } from "@/lib/utils";
import { type Category } from "@/types/category";
import { type ComponentProps, type MouseEvent } from "react";

export type CategoryListProps = ComponentProps<"ul"> & {
  items: Category[];
  onClickCategory?: (id: Category["id"]) => void;
};
export function CategoryList(props: CategoryListProps) {
  const { items, className, onClickCategory, ...rest } = props;

  const handleClickCategoryItem = (e: MouseEvent<HTMLButtonElement>) => {
    const id = Number(e.currentTarget.dataset["categoryId"]);
    onClickCategory?.(id);
  };

  return (
    <ul className={cn(className)} {...rest}>
      {items.map((item) => (
        <li key={item.id} className="border-b">
          <div className="h-12 px-4">
            <CategoryItem
              category={item}
              data-category-id={item.id}
              onClick={handleClickCategoryItem}
              className="h-full w-full"
            ></CategoryItem>
          </div>
        </li>
      ))}
    </ul>
  );
}

type CategoryItemProps = ComponentProps<"button"> & { category: Category };
const CategoryItem = (props: CategoryItemProps) => {
  const { category, className, ...rest } = props;

  return (
    <button
      className={cn(className, "flex flex-row place-items-center gap-2")}
      {...rest}
    >
      <span
        style={{ backgroundColor: category.color }}
        className="size-5 rounded-full"
      ></span>
      {category.name}
    </button>
  );
};
