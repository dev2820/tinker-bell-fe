import { Holiday } from "@/types/holiday";
import { isSameDay } from "date-fns";

export const isHoliday = (holidays: Holiday[], date: Date) => {
  return holidays.findIndex((h) => isSameDay(h.date, date)) >= 0;
};
