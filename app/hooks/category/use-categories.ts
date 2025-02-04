import * as CategoryAPI from "@/utils/api/category";
import type { Category } from "@/types/category";
import { useQuery } from "@tanstack/react-query";
import { CATEGORY_QUERY_KEY } from "./query-key";
import { toCategory } from "@/utils/helper/category";

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: async () => {
      const rawCategories = await CategoryAPI.fetchCategories();
      return rawCategories.map(toCategory);
    },
    initialData: [],
    initialDataUpdatedAt: 0,
  });
};
