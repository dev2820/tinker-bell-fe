import { sendModalCloseEvent, sendModalOpenEvent } from "@/utils/helper/app";
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
    sendModalOpenEvent();
  },
  onClose: () => {
    set({ isOpen: false });
    sendModalCloseEvent();
  },
}));
