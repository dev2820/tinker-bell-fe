import { format as formatDate } from "date-fns";
import { ko } from "date-fns/locale";

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export const formatKoreanDate = (date: Date, format: string) => {
  return formatDate(date, format, { locale: ko });
};

export { formatDate };

export const getToday = () => {
  const _today = new Date();
  const year = _today.getFullYear();
  const month = _today.getMonth();
  const day = _today.getDate();
  return new Date(year, month, day);
};
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
  const date1Korean = `${date1.getFullYear()}${date1.getMonth() + 1}${date1
    .getDate()
    .toString()
    .padStart(2, "0")}`;

  const date2Korean = `${date2.getFullYear()}${date2.getMonth() + 1}${date2
    .getDate()
    .toString()
    .padStart(2, "0")}`;

  return date1Korean === date2Korean;
};

export const calcRelativeDate = (baseDate: Date, relative: number = 0) => {
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() + relative
  );
};
