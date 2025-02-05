import * as TodoAPI from "@/api/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  makeDailyQueryKey,
  makeMonthlyQueryKey,
  TODO_QUERY_KEY,
} from "./query-key";
import { httpClient } from "@/utils/http-client";
import { Todo } from "@/types/todo";
import { partition } from "@/utils/partition";

const deleteTodo = (payload: TodoAPI.DeleteTodoPayload) =>
  TodoAPI.deleteTodo(httpClient, payload);

/**
 * TODO: invalidateQueries가 아닌 업데이트된 내용을 직접 반영해 패치할 일 없게 하기
 */
export function useDeleteTodo(date: Date) {
  const queryClient = useQueryClient();

  const queryKey = makeDailyQueryKey(date);

  return useMutation({
    mutationKey: TODO_QUERY_KEY,
    mutationFn: deleteTodo,
    onMutate: (payload) => {
      const previousTodos = queryClient.getQueryData<Todo[][]>(queryKey);

      queryClient.setQueryData<Todo[][]>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return partition(
          [...oldData].flat(1).filter((todo) => todo.id !== payload.id),
          (todo) => !todo.isCompleted
        );
      });

      return { previousTodos };
    },
    onSuccess: () => {
      // 대상 일자 업데이트
      queryClient.invalidateQueries({
        queryKey: makeDailyQueryKey(date),
      });
      // 대상 월 업데이트
      queryClient.invalidateQueries({
        queryKey: makeMonthlyQueryKey(date),
      });
    },
    onError: (error, _, context) => {
      console.error("Error delete todo:", error);

      if (!context?.previousTodos) return;
      queryClient.setQueryData(queryKey, context.previousTodos);
    },
  });
}
