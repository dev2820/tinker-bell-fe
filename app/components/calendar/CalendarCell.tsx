import { MouseEventHandler } from "react";

interface CalendarCellProps {
  day: number | null;
  isCurrentMonth: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export const CalendarCell = ({ day, isCurrentMonth }: CalendarCellProps) => {
  return (
    <div
      className={`flex items-center justify-center h-10 w-10 rounded-full ${
        isCurrentMonth ? "text-black" : "text-gray-400"
      }`}
    >
      {day}
    </div>
  );
};
