import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type CalendarCellProps = ComponentProps<"button"> & {
  day: number | null;
  isToday: boolean;
  isCurrentMonth: boolean;
  isSaturday?: boolean;
  isSunday?: boolean;
  labelText?: string;
};

export const CalendarCellWithLabel = ({
  day,
  isCurrentMonth,
  isToday,
  isSaturday,
  isSunday,
  labelText,
  ...rest
}: CalendarCellProps) => {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-start h-10 w-8 rounded-md text-black active:bg-primary active:text-primary-foreground transition-colors duration-300",
        isSunday && "text-red-500",
        isSaturday && "text-blue-500",
        !isCurrentMonth && "opacity-30",
        isToday && "bg-primary text-white"
      )}
      {...rest}
    >
      <span className="text-sm">{day}</span>
      {labelText && <small className="text-[10px]">{labelText}</small>}
    </button>
  );
};
