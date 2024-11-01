import { useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";

const Calendar = ({
  today,
  onSelect,
}: {
  today: Date;
  onSelect?: (dateStr: string) => void;
}) => {
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth())
  );

  const handleMonthChange = (delta: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + delta,
      1
    );
    setCurrentDate(newDate);
  };

  const handleSelectDate = (dateStr: string) => {
    onSelect?.(dateStr);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg">
      <CalendarHeader
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        onMonthChange={handleMonthChange}
      />
      <CalendarGrid
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        today={today}
        onSelect={handleSelectDate}
      />
    </div>
  );
};

export default Calendar;
