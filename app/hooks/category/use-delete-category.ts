import * as CategoryAPI from "@/api/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_QUERY_KEY } from "./query-key";
import { Category } from "@/types/category";
import { httpClient } from "@/utils/http-client";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CATEGORY_QUERY_KEY,
    mutationFn: async (payload: CategoryAPI.DeleteCategoryPayload) => {
      return await CategoryAPI.deleteCategory(httpClient, payload);
    },
    onMutate: (payload) => {
      const previousCategories =
        queryClient.getQueryData<Category[]>(CATEGORY_QUERY_KEY);

      queryClient.setQueryData<Category[]>(CATEGORY_QUERY_KEY, (categories) => {
        if (!categories) return categories;

        return categories.filter((c) => c.id !== payload.id);
      });

      return { categories: previousCategories };
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
    onError: (_, __, context) => {
      if (context?.categories) {
        queryClient.setQueryData(CATEGORY_QUERY_KEY, context.categories);
      }
    },
  });
}
