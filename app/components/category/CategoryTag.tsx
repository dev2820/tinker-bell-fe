import { useCategories } from "@/hooks/category/use-categories";
import { Category } from "@/types/category";
import { getCategoryFgColor } from "@/utils/helper/category";

export type CategoryTagProps = { categoryId: Category["id"] };
export function CategoryTag({ categoryId }: CategoryTagProps) {
  const { data: categories } = useCategories();
  const category = categories.find((c) => c.id === categoryId);

  if (!category) return null;

  return (
    <small
      className="text-xs rounded-md py-0.5 px-2"
      style={{
        backgroundColor: category.color,
        color: getCategoryFgColor(category),
      }}
    >
      {category.name}
    </small>
  );
}
