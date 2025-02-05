import * as TodoAPI from "@/api/todo";
import { useMutation } from "@tanstack/react-query";
import { makeDailyQueryKey } from "./query-key";
import { httpClient } from "@/utils/http-client";

const reorderTodo = (payload: TodoAPI.UpdateTodoOrderPayload) =>
  TodoAPI.updateTodoOrder(httpClient, payload);

export function useReorderTodo(date: Date) {
  const queryKey = makeDailyQueryKey(date);

  return useMutation({
    mutationKey: queryKey,
    mutationFn: reorderTodo,
    onError: (error) => {
      console.error("Error ordering item:", error);
    },
  });
}
