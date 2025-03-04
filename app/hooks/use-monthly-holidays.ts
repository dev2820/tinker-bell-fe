import { useQuery } from "@tanstack/react-query";
import * as holidayAPI from "@/api/holiday";
import { httpClient } from "@/utils/http-client";
import { RawHoliday } from "@/types/holiday";

const toHoliday = (rawData: RawHoliday) => ({
  date: new Date(rawData.date),
  dateName: rawData.dateName,
});

export const useMonthlyHolidays = (
  currentYear: number,
  currentMonth: number
) => {
  return useQuery({
    queryKey: [
      "HOLIDAYS",
      `${currentYear}-${String(currentMonth).padStart(2, "0")}`,
    ],
    queryFn: async () => {
      try {
        const res = await holidayAPI.fetchHolidays(
          httpClient,
          currentYear,
          currentMonth
        );
        const holidays = res.map(toHoliday);
        return holidays;
      } catch (err) {
        console.error("Error: fetch holidays", err);
        return [];
      }
    },
    placeholderData: [],
  });
};
