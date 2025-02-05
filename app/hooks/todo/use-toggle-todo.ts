import * as TodoAPI from "@/api/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeDailyQueryKey, makeMonthlyQueryKey } from "./query-key";
import { httpClient } from "@/utils/http-client";
import { Todo } from "@/types/todo";
import { partition } from "@/utils/partition";

const toggleTodo = (payload: TodoAPI.UpdateTodoCompletePayload) =>
  TodoAPI.updateTodoComplete(httpClient, payload);

/**
 * TODO: date update인 것과 아닌 것을 구분하기
 */
export function useToggleTodo(date: Date) {
  const queryClient = useQueryClient();
  const queryKey = makeDailyQueryKey(date);

  return useMutation({
    mutationKey: queryKey,
    mutationFn: toggleTodo,
    onMutate: (payload) => {
      // 낙관적 업데이트
      const previousTodos = queryClient.getQueryData<Todo[][]>(queryKey);

      queryClient.setQueryData<Todo[][]>(queryKey, (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return partition(
          [...oldData.flat(1)].map((todo) =>
            todo.id === payload.id
              ? { ...todo, isCompleted: payload.isCompleted }
              : todo
          ),
          (todo) => !todo.isCompleted
        );
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: makeMonthlyQueryKey(date),
      });
    },
    onError: (error, _, context) => {
      // 낙관적 업데이트 롤백
      console.error("Error toggle item:", error);
      if (context?.previousTodos) {
        queryClient.setQueryData(queryKey, context.previousTodos);
      }
    },
  });
}
