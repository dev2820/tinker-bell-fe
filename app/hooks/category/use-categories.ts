import * as CategoryAPI from "@/utils/api/category";
import type { Category, RawCategory } from "@/types/category";
import { useQuery } from "@tanstack/react-query";
import { CATEGORY_QUERY_KEY } from "./query-key";

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
