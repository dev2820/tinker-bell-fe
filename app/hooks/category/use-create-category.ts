import * as CategoryAPI from "@/utils/api/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_QUERY_KEY } from "./query-key";
import { toCategory } from "@/utils/helper/category";
import { Category } from "@/types/category";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CATEGORY_QUERY_KEY,
    mutationFn: CategoryAPI.createCategory,
    onSuccess: (data) => {
      const updatedCategory = toCategory(data);
      queryClient.setQueryData<Category[]>(CATEGORY_QUERY_KEY, (categories) => {
        if (!categories) return categories;

        return [updatedCategory, ...categories];
      });
      // queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Error create category", error);
    },
  });
}
