import { useCategories } from "@/hooks/category/use-categories";
import { Category } from "@/types/category";
import { getTextColorBasedOnBackground, stringToRGB } from "@/utils/color";

export type CategoryTagProps = { categoryId: Category["id"] };
export function CategoryTag({ categoryId }: CategoryTagProps) {
  const { data: categories } = useCategories();
  const category = categories.find((c) => c.id === categoryId);

  if (!category) return null;

  const [r, g, b] = stringToRGB(category.color as `#${string}`);
  const textColor = getTextColorBasedOnBackground(r, g, b);

  return (
    <small
      className="text-xs rounded-md py-0.5 px-2"
      style={{
        backgroundColor: category.color,
        color: textColor === "black" ? "#232323" : "#EDEDED",
      }}
    >
      {category.name}
    </small>
  );
}
