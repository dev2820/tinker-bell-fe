import { useMockTodoStore } from "@/stores/mock-todo";
import { isTargetDateTodo } from "@/utils/helper/todo";
import { useDebounce } from "./use-debounce";

export const useMockTodo = (currentDate: Date) => {
  const {
    todos,
    updateTodoById,
    deleteTodoById,
    reorderTodos,
    createTodo,
    toggleTodoById,
  } = useMockTodoStore();

  const debouncedUpdateTodoById = useDebounce(updateTodoById, 300);
  return {
    todos: todos.filter((todo) => isTargetDateTodo(todo, currentDate)),
    updateTodoById,
    deleteTodoById,
    debouncedUpdateTodoById,
    createTodo,
    toggleTodoById,
    reorderTodos,
  };
};
