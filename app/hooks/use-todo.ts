import { Todo } from "@/types/todo";
import { useMemo, useState } from "react";

export const useTodo = (defaultTodos: Todo[] = []) => {
  const _completedTodos = defaultTodos.filter((todo) => todo.isCompleted);
  const _incompletedTodos = defaultTodos.filter((todo) => !todo.isCompleted);

  const [incompletedTodos, setIncompletedTodos] =
    useState<Todo[]>(_incompletedTodos);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>(_completedTodos);

  const updateTodoById = (
    id: Todo["id"],
    payload: Partial<Omit<Todo, "id">>
  ) => {
    const incompletedTargetIndex = incompletedTodos.findIndex(
      (todo) => todo.id === id
    );
    if (incompletedTargetIndex >= 0) {
      setIncompletedTodos((todos) =>
        todos.toSpliced(incompletedTargetIndex, 1, {
          ...todos[incompletedTargetIndex],
          ...payload,
        })
      );
      return;
    }
    const completedTargetIndex = completedTodos.findIndex(
      (todo) => todo.id === id
    );
    if (completedTargetIndex > -1) {
      setCompletedTodos((todos) =>
        todos.toSpliced(completedTargetIndex, 1, {
          ...todos[completedTargetIndex],
          ...payload,
        })
      );
    }
  };

  const toggleTodoCompleteById = (id: Todo["id"]) => {
    const incompletedTargetIndex = incompletedTodos.findIndex(
      (todo) => todo.id === id
    );
    if (incompletedTargetIndex > -1) {
      const target = incompletedTodos[incompletedTargetIndex];
      setIncompletedTodos((todos) =>
        todos.toSpliced(incompletedTargetIndex, 1)
      );
      setCompletedTodos((todos) =>
        todos.toSpliced(0, 0, {
          ...target,
          isCompleted: !target.isCompleted,
        })
      );
      return;
    }
    const completedTargetIndex = completedTodos.findIndex(
      (todo) => todo.id === id
    );
    if (completedTargetIndex > -1) {
      const target = completedTodos[completedTargetIndex];
      setCompletedTodos((todos) => todos.toSpliced(completedTargetIndex, 1));
      setIncompletedTodos((todos) =>
        todos.toSpliced(todos.length, 0, {
          ...target,
          isCompleted: !target.isCompleted,
        })
      );
    }
  };

  const deleteTodoById = (id: Todo["id"]) => {
    const incompletedTargetIndex = incompletedTodos.findIndex(
      (todo) => todo.id === id
    );
    if (incompletedTargetIndex >= 0) {
      setIncompletedTodos((todos) =>
        todos.toSpliced(incompletedTargetIndex, 1)
      );
      return;
    }
    const completedTargetIndex = completedTodos.findIndex(
      (todo) => todo.id === id
    );
    if (completedTargetIndex > -1) {
      setCompletedTodos((todos) => todos.toSpliced(completedTargetIndex, 1));
    }
  };

  const addIncompletedTodo = (newTodo: Todo) => {
    setIncompletedTodos((todos) => [...todos, newTodo]);
  };

  const moveIncompletedTodo = (fromIndex: number, toIndex: number) => {
    setIncompletedTodos((todos) => {
      const target = todos[fromIndex];
      return todos
        .filter((todo) => todo.id !== target.id)
        .toSpliced(toIndex, 0, target);
    });
  };

  const moveCompletedTodo = (fromIndex: number, toIndex: number) => {
    setCompletedTodos((todos) => {
      const target = todos[fromIndex];
      return todos
        .filter((todo) => todo.id !== target.id)
        .toSpliced(toIndex, 0, target);
    });
  };

  const allTodos = useMemo(
    () => [...incompletedTodos, ...completedTodos],
    [completedTodos, incompletedTodos]
  );

  // add todo, remove todo, update todo ...
  return {
    allTodos,
    completedTodos,
    incompletedTodos,
    updateTodoById,
    toggleTodoCompleteById,
    deleteTodoById,
    moveIncompletedTodo,
    moveCompletedTodo,
    addIncompletedTodo,
  };
};
