import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "terra-design-system/react";

interface CalendarHeaderProps {
  year: number;
  month: number;
  onMonthChange: (delta: number) => void;
}

export const CalendarHeader = ({
  year,
  month,
  onMonthChange,
}: CalendarHeaderProps) => {
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

  return (
    <div className="flex items-center justify-between mb-4 gap-2">
      <span className="text-lg font-semibold">
        {year}년 {monthNames[month]}
      </span>
      <div className="flex-1"></div>
      <Button
        onClick={() => onMonthChange(-1)}
        size="sm"
        className="text-lg font-bold text-gray-700 hover:text-gray-900"
      >
        <ChevronLeftIcon size={16} />
      </Button>
      <Button
        onClick={() => onMonthChange(1)}
        size="sm"
        className="text-lg font-bold text-gray-700 hover:text-gray-900"
      >
        <ChevronRightIcon size={16} />
      </Button>
    </div>
  );
};
