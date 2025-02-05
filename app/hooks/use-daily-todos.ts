import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as TodoAPI from "@/api/todo";
import { useCallback, useMemo } from "react";
import { Todo } from "@/types/todo";
import { useDebounce } from "./use-debounce";
import { toTodo } from "@/utils/helper/todo";
import { httpClient } from "@/utils/http-client";
import { makeDailyQueryKey } from "./todo/query-key";
import { useCreateTodo } from "./todo/use-create-todo";
import { useDeleteTodo } from "./todo/use-delete-todo";
import { useUpdateTodo } from "./todo/use-update-todo";
import { useToggleTodo } from "./todo/use-toggle-todo";

export const useDailyTodos = (currentDate: Date) => {
  const todoQueryKey = useMemo(() => {
    return makeDailyQueryKey(currentDate);
  }, [currentDate]);

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: todoQueryKey,
    queryFn: async () => {
      try {
        const res = await TodoAPI.fetchTodosByDate(httpClient, currentDate);
        const { completedTodoList, incompletedTodoList } = res;

        return [incompletedTodoList.map(toTodo), completedTodoList.map(toTodo)];
      } catch (err) {
        console.error("Error: fetch todos", err);
        return [[], []];
      }
    },
  });

  const createMutation = useCreateTodo(currentDate);
  const updateMutation = useUpdateTodo(currentDate);
  const deleteMutation = useDeleteTodo(currentDate);
  const toggleMutation = useToggleTodo(currentDate);

  const reorderMutation = useMutation({
    mutationKey: todoQueryKey,
    mutationFn: (payload: TodoAPI.UpdateTodoOrderPayload) =>
      TodoAPI.updateTodoOrder(httpClient, payload),
    onError: (error) => {
      console.error("Error ordering item:", error);
    },
  });

  const updateTodoById = useCallback(
    (id: Todo["id"], payload: Partial<Omit<Todo, "id">>) => {
      if (!data) {
        return;
      }

      const targetTodo = data.flat(1).find((todo) => todo.id === id);
      if (targetTodo) {
        updateMutation.mutate({
          ...targetTodo,
          ...payload,
        });
      }
    },
    [data, updateMutation]
  );

  const debouncedUpdateTodoById = useDebounce(updateTodoById, 500);

  const toggleTodoById = (id: Todo["id"]) => {
    if (!data) {
      return;
    }

    const targetTodo = data.flat(1).find((todo) => todo.id === id);
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
  const commitReorderTodos = () => {
    const todos = queryClient.getQueryData<Todo[][]>(todoQueryKey);
    if (!todos) {
      return;
    }
    reorderMutation.mutate({
      orderList: todos
        .flat()
        .map((todo, index) => ({ id: todo.id, order: index })),
    });
  };

  const reorderIncompletedTodos = (todos: Todo[]) => {
    // setDataQuery로 데이터 변경 적용
    // 이후 1초 debounce로 reorder api 호출
    queryClient.setQueryData<Todo[][]>(todoQueryKey, (oldData) => {
      if (!oldData) {
        return oldData;
      }
      return [todos, oldData[1]];
    });
  };
  const reorderCompletedTodos = (todos: Todo[]) => {
    // setDataQuery로 데이터 변경 적용
    // 이후 1초 debounce로 reorder api 호출
    queryClient.setQueryData<Todo[][]>(todoQueryKey, (oldData) => {
      if (!oldData) {
        return oldData;
      }
      return [oldData[0], todos];
    });
  };

  const findTodoById = (id: Todo["id"]) => {
    const todos = data ? data.flat(1) : [];
    return todos.find((todo) => todo.id === id);
  };

  return {
    isLoading,
    incompletedTodos: data?.[0] ?? [],
    completedTodos: data?.[1] ?? [],
    findTodoById,
    updateTodoById,
    debouncedUpdateTodoById,
    toggleTodoById,
    createTodo,
    reorderIncompletedTodos,
    reorderCompletedTodos,
    deleteTodoById,
    commitReorderTodos,
  };
};
