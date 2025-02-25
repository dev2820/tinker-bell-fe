import * as CategoryAPI from "@/api/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_QUERY_KEY } from "./query-key";
import { toCategory } from "@/utils/helper/category";
import { Category } from "@/types/category";
import { httpClient } from "@/utils/http-client";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CATEGORY_QUERY_KEY,
    mutationFn: async (payload: CategoryAPI.CreateCategoryPayload) => {
      return await CategoryAPI.createCategory(httpClient, payload);
    },
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
