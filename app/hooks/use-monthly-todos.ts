import { useQuery } from "@tanstack/react-query";
import * as todoAPI from "@/utils/api/todo";
import { useMemo } from "react";
import { toTodo } from "@/utils/helper/todo";

const makeQueryKey = (year: number, month: number) => {
  return ["todos", `${year}-${String(month + 1).padStart(2, "0")}`];
};
export const useMonthlyTodos = (currentYear: number, currentMonth: number) => {
  const todoQueryKey = useMemo(() => {
    return makeQueryKey(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const { data } = useQuery({
    queryKey: todoQueryKey,
    queryFn: async () => {
      try {
        const res = await todoAPI.fetchMonthTodos(currentYear, currentMonth);
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
