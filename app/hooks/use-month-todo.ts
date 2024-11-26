import { useQuery } from "@tanstack/react-query";
import * as todoAPI from "@/utils/api/todo";
import { useMemo } from "react";

const makeQueryKey = (year: number, month: number) => {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
};
export const useMonthTodo = (currentYear: number, currentMonth: number) => {
  const todoQueryKey = useMemo(() => {
    return makeQueryKey(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const { data: todos } = useQuery({
    queryKey: ["todos", todoQueryKey],
    queryFn: async () => {
      const res = await todoAPI.fetchMonthTodos(currentYear, currentMonth);
      if (res.isFailed) {
        throw res.error;
      }
      const todos = res.value;

      return todos;
    },
  });

  return {
    todos,
  };
};
