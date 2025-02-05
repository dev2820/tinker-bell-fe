import * as TodoAPI from "@/api/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeDailyQueryKey } from "./query-key";
import { httpClient } from "@/utils/http-client";

const createTodo = (payload: TodoAPI.CreateTodoPayload) =>
  TodoAPI.createTodo(httpClient, payload);

/**
 * TODO: invalidateQueries가 아닌 업데이트된 내용을 직접 반영해 패치할 일 없게 하기
 */
export function useCreateTodo(date: Date) {
  const queryClient = useQueryClient();
  const queryKey = makeDailyQueryKey(date);
  return useMutation({
    mutationKey: queryKey,
    mutationFn: createTodo,
    onSuccess: () => {
      // 대상 일자 업데이트
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      // 대상 월 업데이트
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
    onError: (error) => {
      console.error("Error add todo:", error);
    },
  });
}
