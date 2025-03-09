import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ThemeState {
  theme: "dark" | "light" | "system";
}

interface ThemeAction {
  changeTheme: () => void;
}

export const useThemeStore = create<ThemeState & ThemeAction>()(
  persist(
    (set, get) => ({
      theme: "system",
      changeTheme: () => {
        const currentTheme = get().theme;
        if (currentTheme === "light") {
          set({ theme: "system" });
        } else if (currentTheme === "dark") {
          set({ theme: "light" });
        } else {
          set({ theme: "dark" });
        }
      },
    }),
    {
      name: "theme",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
