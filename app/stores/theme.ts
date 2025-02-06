import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ThemeState {
  theme: "dark" | "light";
}

interface ThemeAction {
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState & ThemeAction>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        set({ theme: get().theme === "light" ? "dark" : "light" });
      },
    }),
    {
      name: "theme", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
