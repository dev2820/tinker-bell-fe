import * as CategoryAPI from "@/utils/api/category";
import type { Category, RawCategory } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

const CATEGORY_QUERY_KEY = ["categories"] as const;

const toCategory = (rawData: RawCategory) => {
  return { ...rawData };
};
export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: async () => {
      const rawCategories = await CategoryAPI.fetchCategories();
      return rawCategories.map(toCategory);
    },
    initialData: [],
  });
};
