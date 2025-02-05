import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as TodoAPI from "@/api/todo";
import { useCallback, useMemo } from "react";
import { Todo } from "@/types/todo";
import { useDebounce } from "./use-debounce";
import { toTodo } from "@/utils/helper/todo";
import { partition } from "@/utils/partition";
import { httpClient } from "@/utils/http-client";
import { makeDailyQueryKey, makeMonthlyQueryKey } from "./todo/query-key";
import { useCreateTodo } from "./todo/use-create-todo";
import { useDeleteTodo } from "./todo/use-delete-todo";
import { useUpdateTodo } from "./todo/use-update-todo";

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
  const toggleMutation = useMutation({
    mutationKey: todoQueryKey,
    mutationFn: (payload: TodoAPI.UpdateTodoCompletePayload) =>
      TodoAPI.updateTodoComplete(httpClient, payload),
    onMutate: (payload) => {
      // 낙관적 업데이트
      const previousTodos = queryClient.getQueryData<Todo[][]>(todoQueryKey);

      queryClient.setQueryData<Todo[][]>(todoQueryKey, (oldData) => {
        if (!oldData) {
          return oldData;
        }

        const allTodos = oldData.flat(1);
        const targetIndex = allTodos.findIndex(
          (todo) => todo.id === payload.id
        );

        if (targetIndex < 0) {
          return oldData;
        }

        const newTodo: Todo = {
          ...allTodos[targetIndex],
          isCompleted: payload.isCompleted,
        };

        const updatedTodos = allTodos.toSpliced(targetIndex, 1, newTodo);

        return partition(updatedTodos, (todo) => !todo.isCompleted);
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: makeMonthlyQueryKey(currentDate),
      });
    },
    onError: (error, _, context) => {
      // 낙관적 업데이트 롤백
      console.error("Error toggle item:", error);
      if (context?.previousTodos) {
        queryClient.setQueryData(todoQueryKey, context.previousTodos);
      }
    },
  });
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
