import { Todo } from "@/types/todo";
import { create } from "zustand";

let mockId = 0;

interface MockTodoState {
  todos: Todo[];
}
interface MockTodoAction {
  updateTodoById: (id: Todo["id"], payload: Partial<Omit<Todo, "id">>) => void;
  toggleTodoById: (id: Todo["id"]) => void;
  createTodo: (payload: Omit<Todo, "id" | "isCompleted">) => void;
  deleteTodoById: (id: Todo["id"]) => void;
  reorderTodos: (todos: Todo[]) => void;
}

export const useMockTodoStore = create<MockTodoState & MockTodoAction>(
  (set, get) => ({
    todos: [],
    updateTodoById: (id, payload) => {
      const todos = get().todos;
      const targetIndex = todos.findIndex((todo) => todo.id === id);
      if (targetIndex < 0) {
        return;
      }

      const targetTodo = todos[targetIndex];

      set({
        todos: todos.toSpliced(targetIndex, 1, {
          ...targetTodo,
          ...payload,
        }),
      });
    },
    toggleTodoById: (id) => {
      const todos = get().todos;
      const targetIndex = todos.findIndex((todo) => todo.id === id);
      if (targetIndex < 0) {
        return;
      }

      const targetTodo = todos[targetIndex];

      set({
        todos: todos.toSpliced(targetIndex, 1, {
          ...targetTodo,
          isCompleted: !targetTodo.isCompleted,
        }),
      });
    },
    createTodo: (payload) => {
      const todos = get().todos;
      console.log(payload, todos);
      set({
        todos: [...todos, { ...payload, id: mockId++, isCompleted: false }],
      });
    },
    deleteTodoById: (id) => {
      const todos = get().todos;

      set({
        todos: todos.filter((todo) => todo.id !== id),
      });
    },
    reorderTodos: (todos) => {
      // 기존 todo에 todos의 새 order를 적용해야한다.
      set({
        todos: [...todos],
      });
    },
  })
);
