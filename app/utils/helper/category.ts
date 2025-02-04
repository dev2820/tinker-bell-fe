import type { Category, RawCategory } from "@/types/category";

export const toCategory = (rawData: RawCategory): Category => {
  return { ...rawData };
};
