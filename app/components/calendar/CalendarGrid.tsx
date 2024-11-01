import { MouseEvent } from "react";
import { CalendarCell } from "./CalendarCell";

interface CalendarGridProps {
  year: number;
  month: number;
  date: number;
  onSelect: (dateStr: string) => void;
}

export const CalendarGrid = ({
  year,
  month,
  date,
  onSelect,
}: CalendarGridProps) => {
  // todo: date는 오늘 날짜 표기용
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDay = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);

  const days: (number | null)[] = [];

  // 이전 월의 날짜들
  for (let i = startDay - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i).getDate());
  }

  // 현재 월의 날짜들
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // 다음 월의 날짜들
  const nextMonthDays = 42 - days.length; // 42 cells for 6 rows (7 columns)
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push(i);
  }

  const handleClickCell = (e: MouseEvent<HTMLDivElement>) => {
    const day = Number(e.currentTarget.dataset["day"]);
    onSelect(`${year}-${month}-${day}`);
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => (
        <CalendarCell
          key={index}
          day={day}
          data-day={day}
          isCurrentMonth={index >= startDay && index < startDay + daysInMonth}
          onClick={handleClickCell}
        />
      ))}
    </div>
  );
};
