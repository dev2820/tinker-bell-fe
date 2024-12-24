import { Todo } from "@/types/todo";
import { useState } from "react";

export const useCurrentTodo = (defaultTodo?: Todo) => {
  const [currentTodo, setCurrentTodo] = useState<Todo>(
    defaultTodo ?? {
      id: -1,
      title: "",
      date: {
        year: 1970,
        month: 1,
        day: 1,
      },
      description: "",
      order: -1,
      isCompleted: false,
    }
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
