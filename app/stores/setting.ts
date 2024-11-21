// store.ts
import { create } from "zustand";

interface SettingState {
  filterOption: "all" | "not-completed" | "completed";
  changeFilter: (filterOption: "all" | "not-completed" | "completed") => void;
}

export const useSettingStore = create<SettingState>((set) => ({
  filterOption: "all",
  changeFilter: (option) => set(() => ({ filterOption: option })),
}));
