import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "terra-design-system/react";
import { useCalendar } from "./CalendarRoot";
import { ComponentProps } from "react";
import { cn } from "@/utils/cn";

type CalendarHeaderProps = Omit<ComponentProps<"div">, "children">;

export const CalendarHeader = (props: CalendarHeaderProps) => {
  const { className, ...rest } = props;
  const { shownDate, swiperRef } = useCalendar();
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const handleClickPrevMonth = () => {
    swiperRef?.slidePrev(0);
  };
  const handleClickNextMonth = () => {
    swiperRef?.slideNext(0);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-4 px-6",
        className
      )}
      {...rest}
    >
      <Button
        onClick={handleClickPrevMonth}
        variant="ghost"
        size="sm"
        className="text-lg font-bold text-gray-700 hover:text-gray-900"
      >
        <ChevronLeftIcon size={16} />
      </Button>
      <span className="text-lg font-semibold w-30 text-center text-nowrap">
        {shownDate.getFullYear()}년 {monthNames[shownDate.getMonth()]}
      </span>
      <Button
        onClick={handleClickNextMonth}
        variant="ghost"
        size="sm"
        className="text-lg font-bold text-gray-700 hover:text-gray-900"
      >
        <ChevronRightIcon size={16} />
      </Button>
    </div>
  );
};
