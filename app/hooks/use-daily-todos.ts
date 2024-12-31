import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as todoAPI from "@/utils/api/todo";
import { useCallback, useMemo } from "react";
import { formatDate, isSameDay } from "date-fns";
import { Todo } from "@/types/todo";
import { useDebounce } from "./use-debounce";
import { isThatDateTodo, toTodo } from "@/utils/helper/todo";
import { partition } from "@/utils/partition";
import { getWeekDays } from "@/utils/date-time";

const makeDailyQueryKey = (date: Date) => {
  return ["todo", formatDate(date, "yyyy-MM-dd")];
};
export const useDailyTodos = (currentDate: Date) => {
  const todoQueryKey = useMemo(() => {
    return makeDailyQueryKey(currentDate);
  }, [currentDate]);

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: todoQueryKey,
    queryFn: async () => {
      try {
        const res = await todoAPI.fetchTodosByDate(currentDate);
        const { completedTodoList, incompletedTodoList } = res;

        return [incompletedTodoList.map(toTodo), completedTodoList.map(toTodo)];
      } catch (err) {
        console.error("Error: fetch todos", err);
        return [[], []];
      }
    },
  });

  const createMutation = useMutation({
    mutationKey: todoQueryKey,
    mutationFn: todoAPI.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todoQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["todos", formatDate(currentDate, "yyyy-MM")],
      });
      const week = getWeekDays(currentDate);
      queryClient.invalidateQueries({
        queryKey: [
          "todos",
          `${week[0].toISOString()}~${week[week.length - 1].toISOString()}`,
        ],
      });
    },
    onError: (error) => {
      console.error("Error add item:", error);
    },
  });
  const updateMutation = useMutation({
    mutationKey: todoQueryKey,
    mutationFn: todoAPI.updateTodo,
    onMutate: (payload) => {
      // 낙관적 업데이트
      const previousTodos = queryClient.getQueryData<Todo[][]>(todoQueryKey);

      queryClient.setQueryData<Todo[][]>(todoQueryKey, (oldData) => {
        if (!oldData) {
          return oldData;
        }

        const allTodos = oldData.flat(1);
        const oldTodoIndex = allTodos.findIndex(
          (todo) => todo.id === payload.id
        );
        if (oldTodoIndex < 0) {
          return oldData;
        }
        const oldTodo = allTodos[oldTodoIndex];

        const updatedTodos = allTodos
          .toSpliced(oldTodoIndex, 1, {
            ...oldTodo,
            ...payload,
          })
          .filter((todo) => isThatDateTodo(todo, currentDate));
        return partition(updatedTodos, (todo) => !todo.isCompleted);
      });

      return { previousTodos };
    },
    onSuccess: (_, payload) => {
      if (!payload.date) {
        return;
      }

      const newDate = new Date(
        payload.date.year,
        payload.date.month - 1,
        payload.date.day
      );
      if (isSameDay(newDate, currentDate)) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: makeDailyQueryKey(newDate),
      });
      queryClient.invalidateQueries({
        queryKey: ["todos", formatDate(currentDate, "yyyy-MM")],
      });
      const week = getWeekDays(currentDate);
      queryClient.invalidateQueries({
        queryKey: [
          "todos",
          `${week[0].toISOString()}~${week[week.length - 1].toISOString()}`,
        ],
      });
    },
    onError: (error, _, context) => {
      // 낙관적 업데이트 롤백
      console.error("Error update item:", error);
      if (context?.previousTodos) {
        queryClient.setQueryData(todoQueryKey, context.previousTodos);
      }
    },
  });
  const deleteMutation = useMutation({
    mutationKey: todoQueryKey,
    mutationFn: todoAPI.deleteTodo,
    onMutate: (payload) => {
      // 낙관적 업데이트
      const previousTodos = queryClient.getQueryData<Todo[][]>(todoQueryKey);

      queryClient.setQueryData<Todo[][]>(todoQueryKey, (oldData) => {
        if (!oldData) {
          return oldData;
        }

        const allTodos = oldData.flat(1);
        const deleteIndex = allTodos.findIndex(
          (todo) => todo.id === payload.id
        );

        if (deleteIndex < 0) {
          return oldData;
        }

        const updatedTodos = allTodos.toSpliced(deleteIndex, 1);

        return partition(updatedTodos, (todo) => !todo.isCompleted);
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos", formatDate(currentDate, "yyyy-MM")],
      });
      const week = getWeekDays(currentDate);
      queryClient.invalidateQueries({
        queryKey: [
          "todos",
          `${week[0].toISOString()}~${week[week.length - 1].toISOString()}`,
        ],
      });
    },
    onError: (error, _, context) => {
      // 낙관적 업데이트 롤백
      console.error("Error update item:", error);
      if (context?.previousTodos) {
        queryClient.setQueryData(todoQueryKey, context.previousTodos);
      }
    },
  });
  const toggleMutation = useMutation({
    mutationKey: todoQueryKey,
    mutationFn: todoAPI.updateTodoComplete,
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
        queryKey: ["todos", formatDate(currentDate, "yyyy-MM")],
      });
      const week = getWeekDays(currentDate);
      queryClient.invalidateQueries({
        queryKey: [
          "todos",
          `${week[0].toISOString()}~${week[week.length - 1].toISOString()}`,
        ],
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
    mutationFn: todoAPI.updateTodoOrder,
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

  const debouncedUpdateTodoById = useDebounce(updateTodoById, 300);

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
