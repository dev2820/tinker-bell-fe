import { format as formatDate, lastDayOfMonth, startOfMonth } from "date-fns";
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

export const calcRelativeMonth = (baseDate: Date, relative: number = 0) => {
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + relative,
    baseDate.getDate()
  );
};

export const getWeekDays = (date: Date) => {
  const day = date.getDay();
  const firstDayOfWeek = addDays(date, -day);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(firstDayOfWeek, i));
  }

  return days;
};

export const getCalendarDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDate = startOfMonth(date);
  const lastDate = lastDayOfMonth(date);

  const days = [];

  // 지난 달
  for (let i = firstDate.getDay() - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // 이번 달
  for (let i = 1; i <= lastDate.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // 다음 달
  const nextMonthDays = 42 - days.length; // 42 cells for 6 rows (7 columns)
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};
