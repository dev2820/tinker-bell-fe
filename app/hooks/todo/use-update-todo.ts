import * as TodoAPI from "@/api/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeDailyQueryKey, makeMonthlyQueryKey } from "./query-key";
import { httpClient } from "@/utils/http-client";
import { Todo } from "@/types/todo";
import { partition } from "@/utils/partition";
import { isThatDateTodo } from "@/utils/helper/todo";
import { isSameDay } from "date-fns";

const updateTodo = (payload: TodoAPI.UpdateTodoPayload) =>
  TodoAPI.updateTodo(httpClient, payload);

/**
 * TODO: date update인 것과 아닌 것을 구분하기
 */
export function useUpdateTodo(date: Date) {
  const queryClient = useQueryClient();
  const queryKey = makeDailyQueryKey(date);

  return useMutation({
    mutationKey: queryKey,
    mutationFn: updateTodo,
    onMutate: (payload) => {
      const previousTodos = queryClient.getQueryData<Todo[][]>(queryKey);

      queryClient.setQueryData<Todo[][]>(queryKey, (oldData) => {
        if (!oldData) {
          return oldData;
        }

        const allTodos = oldData.flat(1);
        const oldTodoIndex = allTodos.findIndex(
          (todo) => todo.id === payload.id
        );
        if (oldTodoIndex < 0) {
          return oldData;
        }
        const oldTodo = allTodos[oldTodoIndex];

        const updatedTodos = allTodos
          .toSpliced(oldTodoIndex, 1, {
            ...oldTodo,
            ...payload,
          })
          .filter((todo) => isThatDateTodo(todo, date));
        return partition(updatedTodos, (todo) => !todo.isCompleted);
      });

      return { previousTodos };
    },
    onSuccess: (_, payload) => {
      if (!payload.date) {
        return;
      }

      const newDate = new Date(
        payload.date.year,
        payload.date.month - 1,
        payload.date.day
      );
      if (isSameDay(newDate, date)) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: makeDailyQueryKey(newDate),
      });
      queryClient.invalidateQueries({
        queryKey: makeMonthlyQueryKey(date),
        refetchType: "all",
      });
    },
    onError: (error, _, context) => {
      console.error("Error update todo:", error);

      if (!context?.previousTodos) return;
      queryClient.setQueryData(queryKey, context.previousTodos);
    },
  });
}
