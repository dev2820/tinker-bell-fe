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

  // add todo, remove todo, update todo ...
  return {
    allTodos: todos,
    completedTodos,
    incompletedTodos,
    updateTodoById,
    toggleTodoCompleteById,
    deleteTodoById,
    setTodos,
  };
};
