import * as CategoryAPI from "@/utils/api/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_QUERY_KEY } from "./query-key";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CATEGORY_QUERY_KEY,
    mutationFn: CategoryAPI.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Error delete category", error);
    },
  });
}
