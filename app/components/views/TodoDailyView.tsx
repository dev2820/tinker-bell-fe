import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { DateSelector } from "../DateSelector";
import { useWindowSize } from "@/hooks/use-window-size";
import { ClientOnly } from "remix-utils/client-only";

type TodoDailyViewProps = ComponentProps<"div">;
export function TodoDailyView(props: TodoDailyViewProps) {
  const { className, ...rest } = props;
  const { width, height } = useWindowSize();

  return (
    <div className={cn("flex flex-col relative", className)} {...rest}>
      <ClientOnly>
        {() => (
          <DateSelector
            className="flex-none"
            width={width - 32}
            height={height - 64}
          />
        )}
      </ClientOnly>
    </div>
  );
}
