import { cn } from "@/utils/cn";
import {
  addMonths,
  isSameMonth,
  isSaturday,
  isSunday,
  subMonths,
} from "date-fns";
import { ComponentProps, MouseEvent } from "react";
import { useCalendar } from "./CalendarRoot";
import { useMonthlyHolidays } from "@/hooks/use-monthly-holidays";
import { isHoliday } from "@/utils/helper/holiday";

type CalendarCellProps = ComponentProps<"button"> & {
  year: number;
  month: number;
  day: number;
  labelText?: string;
};

export const CalendarCellWithLabel = (props: CalendarCellProps) => {
  const { year, month, day, labelText, onClick, className, ...rest } = props;
  const { data: holidays } = useMonthlyHolidays(year, month + 1);
  const { onSelectDate, onChangeShownDate, shownDate, swiperRef } =
    useCalendar();
  const date = new Date(year, month, day);

  const handleClickDate = (e: MouseEvent<HTMLButtonElement>) => {
    const { year, month, day } = e.currentTarget.dataset;
    const selectedDate = new Date(Number(year), Number(month), Number(day));

    const prevMonthDate = subMonths(shownDate, 1);
    const nextMonthDate = addMonths(shownDate, 1);

    if (isSameMonth(prevMonthDate, selectedDate)) {
      swiperRef?.slidePrev(200);
      onChangeShownDate(prevMonthDate);
    }
    if (isSameMonth(nextMonthDate, selectedDate)) {
      swiperRef?.slideNext(200);
      onChangeShownDate(nextMonthDate);
    }

    onSelectDate(selectedDate);
    onClick?.(e);
  };

  return (
    <button
      className={cn(
        "flex flex-col items-center justify-start rounded-md active:bg-layer-pressed transition-colors duration-300",
        isSunday(date) && "text-red-500",
        isSaturday(date) && "text-blue-500",
        isHoliday(holidays ?? [], date) && "text-red-500",
        className
      )}
      onClick={handleClickDate}
      {...rest}
    >
      <span className="text-md">{day}</span>
      {labelText && <small className="text-[10px]">{labelText}</small>}
    </button>
  );
};
