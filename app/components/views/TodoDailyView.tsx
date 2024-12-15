import { cn } from "@/lib/utils";
import { formatDate, formatKoreanDate } from "@/utils/date-time";
import { ComponentProps, useRef } from "react";
import "swiper/css";
import "swiper/css/virtual";
import { useCurrentDateStore } from "@/stores/current-date";
import { DateSelector } from "../DateSelector";
import { useWindowSize } from "@/hooks/use-window-size";
import { ClientOnly } from "remix-utils/client-only";

type TodoDailyViewProps = ComponentProps<"div">;
export function TodoDailyView(props: TodoDailyViewProps) {
  const { className, ...rest } = props;
  const { currentDate, changeCurrentDate } = useCurrentDateStore();
  const dateSelectorRef = useRef<HTMLDivElement>(null);
  const { height } = useWindowSize();

  return (
    <div className={cn("pb-4 flex flex-col", className)} {...rest}>
      <h2 className="flex-none h-[72px] text-center pt-4">
        <small className="block">
          {formatKoreanDate(currentDate, "yyyy년 MM월 dd일")}
        </small>
        <div className="relative flex flex-row place-items-center justify-center gap-3">
          <time
            dateTime={formatDate(currentDate, "yyyy-MM-dd")}
            className="font-bold w-12"
          >
            {formatKoreanDate(currentDate, "EEEE")}
          </time>
        </div>
      </h2>
      <ClientOnly>
        {() => (
          <DateSelector
            className="flex-none"
            ref={dateSelectorRef}
            height={height - (72 + 48 + 32)}
            currentDate={currentDate}
            onChangeDate={changeCurrentDate}
          />
        )}
      </ClientOnly>
    </div>
  );
}
