import { MouseEvent } from "react";
import { CalendarCell } from "./CalendarCell";
import { cn } from "@/lib/utils";
import { isSaturday, isSunday } from "date-fns";

interface CalendarGridProps {
  year: number;
  month: number;
  today: Date;
  onSelect: (dateStr: string) => void;
  className: string;
}

export const CalendarGrid = ({
  year,
  month,
  today,
  onSelect,
  className,
}: CalendarGridProps) => {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDay = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);
  const days: [number, number, number][] = [];

  // 이전 월의 날짜들
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push([date.getFullYear(), date.getMonth(), date.getDate()]);
  }

  // 현재 월의 날짜들
  for (let i = 1; i <= daysInMonth; i++) {
    days.push([year, month, i]);
  }

  // 다음 월의 날짜들
  const nextMonthDays = 42 - days.length; // 42 cells for 6 rows (7 columns)
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push([date.getFullYear(), date.getMonth(), date.getDate()]);
  }

  const handleClickCell = (e: MouseEvent<HTMLButtonElement>) => {
    const day = Number(e.currentTarget.dataset["day"]);
    const month = Number(e.currentTarget.dataset["month"]);
    onSelect(
      `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`
    );
  };

  return (
    <div className={cn("grid grid-cols-7 gap-1 place-items-center", className)}>
      {["일", "월", "화", "수", "목", "금", "토"].map((dayOfWeek) => (
        <span
          className={cn(
            "w-8 h-8 text-center leading-10 text-green",
            dayOfWeek === "일" && "text-red-500",
            dayOfWeek === "토" && "text-blue-500"
          )}
          key={dayOfWeek}
        >
          {dayOfWeek}
        </span>
      ))}
      {days.map(([year, month, day], index) => (
        <CalendarCell
          key={index}
          day={day}
          data-day={day}
          data-month={month}
          isCurrentMonth={index >= startDay && index < startDay + daysInMonth}
          isSaturday={isSaturday(new Date(year, month, day))}
          isSunday={isSunday(new Date(year, month, day))}
          onClick={handleClickCell}
          isToday={
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year
          }
        />
      ))}
    </div>
  );
};
