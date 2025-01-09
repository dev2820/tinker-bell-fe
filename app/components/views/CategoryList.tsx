import { type Category } from "@/types/category";
import { ComponentProps } from "react";

export type CategoryListProps = ComponentProps<"ul"> & {
  items: Category[];
};
export function CategoryList(props: CategoryListProps) {
  const { items, ...rest } = props;
  return (
    <ul {...rest}>
      {items.map((item) => (
        <li key={item.id}>
          <CategoryItem></CategoryItem>
        </li>
      ))}
    </ul>
  );
}

const CategoryItem = () => {
  return <div>item</div>;
};
