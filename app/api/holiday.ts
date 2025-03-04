import { RawHoliday } from "@/types/holiday";
import { KyInstance } from "ky";

/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/common-controller/getHolidays
 */
export async function fetchHolidays(
  client: KyInstance,
  year: number,
  month: number
) {
  return await client
    .get(`holidays`, {
      searchParams: {
        year: String(year),
        month: String(month).padStart(2, "0"),
      },
    })
    .json<RawHoliday[]>();
}
