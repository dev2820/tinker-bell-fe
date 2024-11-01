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
  const [currentDate, setCurrentDate] = useState(today);

  const handleMonthChange = (delta: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + delta,
      currentDate.getDate()
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
        date={currentDate.getDate()}
        onSelect={handleSelectDate}
      />
    </div>
  );
};

export default Calendar;
