import { Todo } from "@/types/todo";
import { sendModalOpenEvent, sendModalCloseEvent } from "@/utils/helper/app";
import { create } from "zustand";

interface TodoDetailDrawerState {
  isOpen: boolean;
  currentTodo: Todo;
}
interface TodoDetailDrawerAction {
  onOpen: () => void;
  onClose: () => void;
  changeCurrentTodo: (params: Partial<Todo>) => void;
}

export const useTodoDetailDrawerStore = create<
  TodoDetailDrawerState & TodoDetailDrawerAction
>((set, get) => ({
  isOpen: false,
  currentTodo: {
    id: -1,
    title: "",
    date: {
      year: 0,
      month: 0,
      day: 0,
    },
    isCompleted: false,
    description: "",
    order: 0,
    categoryList: [],
  },
  onOpen: () => {
    set({ isOpen: true });
    sendModalOpenEvent();
  },
  onClose: () => {
    set({ isOpen: false });
    sendModalCloseEvent();
  },
  changeCurrentTodo: (params: Partial<Todo>) => {
    set({
      currentTodo: {
        ...get().currentTodo,
        ...params,
      },
    });
  },
}));
