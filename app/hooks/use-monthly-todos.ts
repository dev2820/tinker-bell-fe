import { useQuery } from "@tanstack/react-query";
import * as todoAPI from "@/api/todo";
import { toTodo } from "@/utils/helper/todo";
import { httpClient } from "@/utils/http-client";
import { makeMonthlyQueryKey } from "./todo/query-key";

export const useMonthlyTodos = (currentYear: number, currentMonth: number) => {
  const queryKey = makeMonthlyQueryKey(new Date(currentYear, currentMonth));

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const res = await todoAPI.fetchMonthTodos(
          httpClient,
          currentYear,
          currentMonth
        );
        const { completedTodoList, incompletedTodoList } = res;

        return [incompletedTodoList.map(toTodo), completedTodoList.map(toTodo)];
      } catch (err) {
        console.error("Error: fetch monthly todos", err);
        return [[], []];
      }
    },
  });

  return {
    incompletedTodos: data?.[0] ?? [],
    completedTodos: data?.[1] ?? [],
  };
};
