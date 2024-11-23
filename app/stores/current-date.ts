import { getToday } from "@/utils/date-time";
import { create } from "zustand";

interface CurrentDateState {
  currentDate: Date;
}

interface CurrentDateAction {
  changeCurrentDate: (date: Date) => void;
}

export const useCurrentDateStore = create<CurrentDateState & CurrentDateAction>(
  (set) => ({
    currentDate: getToday(),
    changeCurrentDate: (date) => {
      set({ currentDate: date });
    },
  })
);
