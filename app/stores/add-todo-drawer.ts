import { create } from "zustand";

interface AddTodoDrawerState {
  isOpen: boolean;
}
interface AddTodoDrawerAction {
  onOpen: () => void;
  onClose: () => void;
}

export const useAddTodoDrawerStore = create<
  AddTodoDrawerState & AddTodoDrawerAction
>((set) => ({
  isOpen: false,
  onOpen: () => {
    set({ isOpen: true });
  },
  onClose: () => {
    set({ isOpen: false });
  },
}));
