import { cn } from "@/utils/cn";
import { Category } from "@/types/category";
import { type ComponentProps } from "react";

export type CategoryItemProps = ComponentProps<"div"> & {
  category: Category;
};
export const CategoryItem = (props: CategoryItemProps) => {
  const { category, className, ...rest } = props;

  return (
    <div
      className={cn(className, "flex flex-row place-items-center gap-2")}
      {...rest}
    >
      <span
        style={{ backgroundColor: category.color }}
        className="size-5 rounded-full"
      ></span>
      {category.name}
    </div>
  );
};
