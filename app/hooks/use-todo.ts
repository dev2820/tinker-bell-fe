import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isTargetDateTodo } from "@/utils/helper/todo";
import * as todoAPI from "@/utils/api/todo";
import { useCallback, useMemo } from "react";
import { formatDate } from "date-fns";
import { Todo } from "@/types/todo";
import { isNil } from "@/utils/type-guard";
import { useDebounce } from "./use-debounce";

export const useTodo = (currentDate: Date) => {
  const todoQueryKey = useMemo(() => {
    return formatDate(currentDate, "yyyy-MM-dd");
  }, [currentDate]);

  const queryClient = useQueryClient();
  const { data: todos } = useQuery({
    queryKey: ["todos", todoQueryKey],
    queryFn: async () => {
      const res = await todoAPI.fetchTodos(currentDate);
      if (res.isFailed) {
        throw res.error;
      }
      const todos = res.value;
      /**
       * TODO: server단에서 필터링하도록 수정
       */
      return todos.filter((todo) => isTargetDateTodo(todo, currentDate));
    },
  });
  const updateMutation = useMutation({
    mutationKey: ["todos", todoQueryKey],
    mutationFn: todoAPI.updateTodo,
    onSuccess: (res) => {
      if (res.isFailed) {
        throw res.error;
      }

      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
    onError: (error) => {
      console.error("Error adding item:", error);
    },
  });
  const createMutation = useMutation({
    mutationKey: ["todos", todoQueryKey],
    mutationFn: todoAPI.createTodo,
    onSuccess: (res) => {
      if (res.isFailed) {
        throw res.error;
      }

      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
    onError: (error) => {
      console.error("Error adding item:", error);
    },
  });
  const deleteMutation = useMutation({
    mutationKey: ["todos", todoQueryKey],
    mutationFn: todoAPI.deleteTodo,
    onSuccess: (res) => {
      if (res.isFailed) {
        throw res.error;
      }
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
    onError: (error) => {
      console.error("Error adding item:", error);
    },
  });
  const toggleMutation = useMutation({
    mutationKey: ["todos", todoQueryKey],
    mutationFn: todoAPI.updateTodoComplete,
    onSuccess: (res) => {
      if (res.isFailed) {
        throw res.error;
      }

      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
    onError: (error) => {
      console.error("Error adding item:", error);
    },
  });

  const updateTodoById = useCallback(
    (id: Todo["id"], payload: Partial<Omit<Todo, "id">>) => {
      if (!todos) {
        return;
      }

      const targetTodo = todos.find((todo) => todo.id === id);
      if (isNil(targetTodo)) {
        return;
      }

      updateMutation.mutate({
        ...targetTodo,
        ...payload,
      } satisfies Todo);
    },
    [todos, updateMutation]
  );

  const debouncedUpdateTodoById = useDebounce(updateTodoById, 300);

  const toggleTodoById = (id: Todo["id"]) => {
    if (!todos) {
      return;
    }
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) {
      return;
    }
    toggleMutation.mutate({
      id,
      isCompleted: !targetTodo.isCompleted,
    });
  };

  const createTodo = (payload: Omit<Todo, "id" | "isCompleted">) => {
    createMutation.mutate({
      ...payload,
    });
  };
  const deleteTodoById = (id: Todo["id"]) => {
    deleteMutation.mutate({
      id,
    });
  };
  return {
    todos,
    updateTodoById,
    debouncedUpdateTodoById,
    toggleTodoById,
    createTodo,
    deleteTodoById,
  };
};
