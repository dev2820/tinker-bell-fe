import * as TodoAPI from "@/api/todo";
import { useQuery } from "@tanstack/react-query";
import { makeDailyQueryKey } from "./query-key";
import { httpClient } from "@/utils/http-client";
import { toTodo } from "@/utils/helper/todo";

export const useDayTodos = (date: Date) => {
  const queryKey = makeDailyQueryKey(date);

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const res = await TodoAPI.fetchTodosByDate(httpClient, date);
        const { completedTodoList, incompletedTodoList } = res;

        return [incompletedTodoList.map(toTodo), completedTodoList.map(toTodo)];
      } catch (err) {
        console.error("Error: fetch todos", err);
        return [[], []];
      }
    },
    initialData: [[], []],
    initialDataUpdatedAt: 0,
  });
};
