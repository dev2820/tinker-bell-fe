import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as todoAPI from "@/utils/api/todo";
import { useCallback, useMemo } from "react";
import { formatDate } from "date-fns";
import { Todo } from "@/types/todo";
import { isNil } from "@/utils/type-guard";
import { useDebounce } from "./use-debounce";

const makeQueryKey = (date: Date) => {
  return formatDate(date, "yyyy-MM-dd");
};
export const useTodo = (currentDate: Date) => {
  const todoQueryKey = useMemo(() => {
    return makeQueryKey(currentDate);
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

      return todos;
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
        queryKey: ["todos", todoQueryKey],
      });
      queryClient.invalidateQueries({
        queryKey: ["todos", formatDate(currentDate, "yyyy-MM")],
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
        queryKey: ["todos", todoQueryKey],
      });
      queryClient.invalidateQueries({
        queryKey: ["todos", formatDate(currentDate, "yyyy-MM")],
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
        queryKey: ["todos", todoQueryKey],
      });
    },
    onError: (error) => {
      console.error("Error adding item:", error);
    },
  });
  const reorderMutation = useMutation({
    mutationKey: ["todos", todoQueryKey],
    mutationFn: todoAPI.updateTodoOrder,
    onSuccess: (res) => {
      if (res.isFailed) {
        throw res.error;
      }
    },
    onError: (error) => {
      console.error("Error ordering item:", error);
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
  const reorderTodos = (todos: Todo[]) => {
    reorderMutation.mutate({
      orderList: todos.map((todo, index) => ({ id: todo.id, order: index })),
    });
  };
  const debouncedReorderTodos = useDebounce(reorderTodos, 1000);
  return {
    todos,
    updateTodoById,
    debouncedUpdateTodoById,
    debouncedReorderTodos,
    toggleTodoById,
    createTodo,
    reorderTodos,
    deleteTodoById,
  };
};
