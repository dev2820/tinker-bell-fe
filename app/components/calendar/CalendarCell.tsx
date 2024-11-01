import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type CalendarCellProps = ComponentProps<"button"> & {
  day: number | null;
  isToday: boolean;
  isCurrentMonth: boolean;
};

export const CalendarCell = ({
  day,
  isCurrentMonth,
  isToday,
  ...rest
}: CalendarCellProps) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center h-10 w-10 rounded-full",
        isCurrentMonth ? "text-black" : "text-gray-400",
        isToday && isCurrentMonth && "bg-primary text-white",
        isToday && !isCurrentMonth && "bg-primary text-white opacity-50"
      )}
      {...rest}
    >
      {day}
    </button>
  );
};
