import type { Category, RawCategory } from "@/types/category";
import { getTextColorBasedOnBackground, stringToRGB } from "../color";

export const toCategory = (rawData: RawCategory): Category => {
  return { ...rawData };
};

export const getCategoryFgColor = (category: Category) => {
  const [r, g, b] = stringToRGB(category.color as `#${string}`);
  const textColor = getTextColorBasedOnBackground(r, g, b);

  return textColor === "black" ? "#232323" : "#EDEDED";
};
