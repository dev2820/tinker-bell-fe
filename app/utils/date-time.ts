import { format as formatDate } from "date-fns";
import { ko } from "date-fns/locale";

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export const formatKoreanDate = (date: Date, format: string) => {
  return formatDate(date, format, { locale: ko });
};

export { formatDate };

export const addDays = (date: Date, day: number) => {
  return new Date(date.getTime() + ONE_DAY * day);
};

export const subDays = (date: Date, day: number) => {
  return new Date(date.getTime() - ONE_DAY * day);
};

export const addWeeks = (date: Date, week: number) => {
  return new Date(date.getTime() + ONE_WEEK * week);
};

export const subWeeks = (date: Date, week: number) => {
  return new Date(date.getTime() - ONE_WEEK * week);
};

export const isSameDay = (date1: Date, date2: Date) => {
  const date1Korean = date1.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  });
  const date2Korean = date2.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  });

  return date1Korean === date2Korean;
};
