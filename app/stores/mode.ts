import { create } from "zustand";

interface ModeState {
  isReorderMode: boolean;
}

interface ModeAction {
  onReorderMode: () => void;
  offReorderMode: () => void;
}

export const useModeStore = create<ModeState & ModeAction>((set) => ({
  isReorderMode: false,
  onReorderMode: () => {
    set({ isReorderMode: true });
  },
  offReorderMode: () => {
    set({ isReorderMode: false });
  },
}));
