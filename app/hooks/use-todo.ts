import { Todo } from "@/types/todo";
import { useMemo, useState } from "react";

export const useTodo = (defaultTodos: Todo[] = []) => {
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.isCompleted),
    [todos]
  );
  const incompletedTodos = useMemo(
    () => todos.filter((todo) => !todo.isCompleted),
    [todos]
  );

  const updateTodoById = (
    id: Todo["id"],
    payload: Partial<Omit<Todo, "id">>
  ) => {
    const targetIndex = todos.findIndex((todo) => todo.id === id);
    if (targetIndex > -1) {
      setTodos(
        todos.toSpliced(targetIndex, 1, {
          ...todos[targetIndex],
          ...payload,
        })
      );
    }
  };

  const toggleTodoCompleteById = (id: Todo["id"]) => {
    const targetIndex = todos.findIndex((todo) => todo.id === id);
    if (targetIndex > -1) {
      setTodos(
        todos.toSpliced(targetIndex, 1, {
          ...todos[targetIndex],
          isCompleted: !todos[targetIndex].isCompleted,
        })
      );
    }
  };

  const deleteTodoById = (id: Todo["id"]) => {
    const targetIndex = todos.findIndex((todo) => todo.id === id);
    if (targetIndex > -1) {
      setTodos(todos.toSpliced(targetIndex, 1));
    }
  };

  const moveTodo = (fromIndex: number, toIndex: number) => {
    setTodos((todos) => {
      const target = todos[fromIndex];
      return todos
        .filter((todo) => todo.id !== target.id)
        .toSpliced(toIndex, 0, target);
    });
  };

  // add todo, remove todo, update todo ...
  return {
    allTodos: todos,
    completedTodos,
    incompletedTodos,
    updateTodoById,
    toggleTodoCompleteById,
    deleteTodoById,
    moveTodo,
    setTodos,
  };
};
