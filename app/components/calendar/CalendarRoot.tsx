import { createContext, useContext, ReactNode, useState } from "react";
import { Swiper as SwiperType } from "swiper/types";

interface CalendarContextType {
  baseDate: Date;
  shownDate: Date;
  swiperRef: SwiperType | null;
  setSwiperRef: (newRef: SwiperType | null) => void;
  onChangeShownDate: (newDate: Date) => void;
  onSelectDate: (newDate: Date) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const CalendarRoot = ({
  baseDate,
  onSelectDate,
  onChangeShownDate: _onChangeShownDate,
  children,
}: {
  baseDate: Date;
  onSelectDate: (date: Date) => void;
  onChangeShownDate?: (year: number, month: number) => void;
  children: ReactNode;
}) => {
  const [shownDate, setShownDate] = useState<Date>(baseDate);
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  const onChangeShownDate = (date: Date) => {
    setShownDate(date);
    _onChangeShownDate?.(date.getFullYear(), date.getMonth());
  };
  const ctx = {
    baseDate,
    shownDate,
    swiperRef,
    onSelectDate,
    onChangeShownDate,
    setSwiperRef,
  };

  return (
    <CalendarContext.Provider value={ctx}>{children}</CalendarContext.Provider>
  );
};

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
