import { format as formatDate } from "date-fns";
import { ko } from "date-fns/locale";

export const formatKoreanDate = (date: Date, format: string) => {
  return formatDate(date, format, { locale: ko });
};

export { formatDate };
