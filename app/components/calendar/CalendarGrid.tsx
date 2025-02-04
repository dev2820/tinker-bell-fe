import { cn } from "@/utils/cn";

type CalendarGridProps = {
  year: number;
  month: number;
  className: string;
  children: (days: [number, number, number][]) => React.ReactNode;
};

export const CalendarGrid = (props: CalendarGridProps) => {
  const { year, month, className, children } = props;
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

  return (
    <div className={cn("grid grid-cols-7 gap-1 place-items-center", className)}>
      {["일", "월", "화", "수", "목", "금", "토"].map((dayOfWeek) => (
        <span
          className={cn(
            "w-8 h-8 text-center leading-10",
            dayOfWeek === "일" && "text-red-500",
            dayOfWeek === "토" && "text-blue-500"
          )}
          key={dayOfWeek}
        >
          {dayOfWeek}
        </span>
      ))}
      {children(days)}
    </div>
  );
};
