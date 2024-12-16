import { cn } from "@/lib/utils";
import { addDays, formatDate, formatKoreanDate } from "@/utils/date-time";
import { ComponentProps } from "react";
import { useCurrentDateStore } from "@/stores/current-date";
import { DateSelector } from "../DateSelector";
import { useWindowSize } from "@/hooks/use-window-size";
import { ClientOnly } from "remix-utils/client-only";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type TodoDailyViewProps = ComponentProps<"div">;
export function TodoDailyView(props: TodoDailyViewProps) {
  const { className, ...rest } = props;
  const { currentDate, changeCurrentDate } = useCurrentDateStore();
  const { width, height } = useWindowSize();

  const handleClickPrev = () => {
    changeCurrentDate(addDays(currentDate, -1));
  };
  const handleClickNext = () => {
    changeCurrentDate(addDays(currentDate, 1));
  };
  return (
    <div className={cn("pb-4 flex flex-col relative", className)} {...rest}>
      <h2 className="flex-none h-[72px] text-center pt-4 w-full">
        <div className="bg-red relative flex flex-row place-items-center justify-center gap-3">
          <time
            dateTime={formatDate(currentDate, "yyyy-MM-dd")}
            className="font-bold w-12"
          >
            {formatKoreanDate(currentDate, "EEEE")}
          </time>
        </div>
        <small className="block">
          {formatKoreanDate(currentDate, "yyyy년 MM월 dd일")}
        </small>
      </h2>
      <button
        className="z-100 absolute inline-flex place-items-center justify-center left-8 top-4 w-10 h-10"
        onClick={handleClickPrev}
      >
        <ChevronLeftIcon size={24} />
      </button>
      <button
        className="z-100 absolute inline-flex place-items-center justify-center right-8 top-4 w-10 h-10"
        onClick={handleClickNext}
      >
        <ChevronRightIcon size={24} />
      </button>
      <ClientOnly>
        {() => (
          <DateSelector
            className="flex-none"
            width={width - 32}
            height={height - (72 + 48 + 32)}
          />
        )}
      </ClientOnly>
    </div>
  );
}
