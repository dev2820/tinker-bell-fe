import { useQuery } from "@tanstack/react-query";
import * as todoAPI from "@/api/todo";
import { useMemo } from "react";
import { toTodo } from "@/utils/helper/todo";

const makeQueryKey = (startDate: Date, endDate: Date) => {
  return ["todos", `${startDate.toISOString()}~${endDate.toISOString()}`];
};
export const useTodos = (startDate: Date, endDate: Date) => {
  const todoQueryKey = useMemo(() => {
    return makeQueryKey(startDate, endDate);
  }, [endDate, startDate]);

  const { data } = useQuery({
    queryKey: todoQueryKey,
    queryFn: async () => {
      try {
        const res = await todoAPI.fetchTodos(startDate, endDate);
        const { completedTodoList, incompletedTodoList } = res;

        return [incompletedTodoList.map(toTodo), completedTodoList.map(toTodo)];
      } catch (err) {
        console.error("Error: fetch todos", err);
        return [[], []];
      }
    },
  });

  return {
    incompletedTodos: data?.[0] ?? [],
    completedTodos: data?.[1] ?? [],
  };
};
