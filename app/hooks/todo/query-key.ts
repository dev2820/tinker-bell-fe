import { formatDate } from "@/utils/date-time";

const TODO_QUERY_KEY = ["TODO"];

export const makeDailyQueryKey = (date: Date) => [
  ...TODO_QUERY_KEY,
  formatDate(date, "yyyy-MM-dd"),
];

export const makeMonthlyQueryKey = (date: Date) => [
  ...TODO_QUERY_KEY,
  formatDate(date, "yyyy-MM"),
];
