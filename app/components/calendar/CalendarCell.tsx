import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type CalendarCellProps = ComponentProps<"button"> & {
  day: number | null;
  isToday: boolean;
  isCurrentMonth: boolean;
  isSaturday?: boolean;
  isSunday?: boolean;
};

export const CalendarCell = ({
  day,
  isCurrentMonth,
  isToday,
  isSaturday,
  isSunday,
  ...rest
}: CalendarCellProps) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center h-8 w-8 rounded-full text-black active:bg-primary active:text-primary-foreground transition-colors duration-300",
        isSunday && "text-red-500",
        isSaturday && "text-blue-500",
        !isCurrentMonth && "opacity-30",
        isToday && "bg-primary text-white"
      )}
      {...rest}
    >
      {day}
    </button>
  );
};
