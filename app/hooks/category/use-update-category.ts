import * as CategoryAPI from "@/api/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_QUERY_KEY } from "./query-key";
import { Category } from "@/types/category";
import { httpClient } from "@/utils/http-client";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CATEGORY_QUERY_KEY,
    mutationFn: async (payload: CategoryAPI.UpdateCategoryPayload) => {
      return await CategoryAPI.updateCategory(httpClient, payload);
    },
    onMutate: (payload) => {
      const previousCategories =
        queryClient.getQueryData<Category[]>(CATEGORY_QUERY_KEY);

      queryClient.setQueryData<Category[]>(CATEGORY_QUERY_KEY, (categories) => {
        if (!categories) return categories;

        const targetIndex = categories.findIndex((c) => c.id === payload.id);
        const oldCategory = categories[targetIndex];

        return categories.toSpliced(targetIndex, 1, {
          ...oldCategory,
          ...payload,
        });
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
