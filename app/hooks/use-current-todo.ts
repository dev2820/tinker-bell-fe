import { Todo } from "@/types/todo";
import { getDefaultTodo } from "@/utils/helper/todo";
import { useState } from "react";

export const useCurrentTodo = (defaultTodo?: Todo) => {
  const [currentTodo, setCurrentTodo] = useState<Todo>(
    defaultTodo ?? getDefaultTodo()
  );

  const update = (params: Partial<Todo>) => {
    setCurrentTodo({
      ...currentTodo,
      ...params,
    });
  };

  return {
    value: currentTodo,
    update,
  };
};
