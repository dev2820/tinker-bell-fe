import { cn } from "@/lib/utils";
import { Category } from "@/types/category";
import { type ComponentProps } from "react";

export type CategoryItemProps = ComponentProps<"button"> & {
  category: Category;
};
export const CategoryItem = (props: CategoryItemProps) => {
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
