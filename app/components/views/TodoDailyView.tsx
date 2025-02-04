import { cn } from "@/utils/cn";
import { ComponentProps } from "react";
import { DateSelector } from "../DateSelector";
import { useWindowSize } from "@/hooks/use-window-size";
import { ClientOnly } from "remix-utils/client-only";
// import { ResizableSplitView } from "resizable-split-view/react";

type TodoDailyViewProps = ComponentProps<"div">;
export function TodoDailyView(props: TodoDailyViewProps) {
  const { className, ...rest } = props;
  const { width, height } = useWindowSize();

  return (
    <div className={cn("flex flex-col relative", className)} {...rest}>
      <ClientOnly>
        {() => (
          // <ResizableSplitView
          //   style={{
          //     width: width - 32,
          //     height: height - 64,
          //   }}
          //   options={{
          //     direction: "vertical",
          //     initialSize: 300,
          //     thresholds: [50, 300, 480],
          //     thresholdGuard: 30,
          //     minSize: 50,
          //     maxSize: 480,
          //     paneIds: ["area1", "area2"],
          //   }}
          // >
          //   <div id="area1">pane1</div>
          //   <div id="area2">pane2</div>
          // </ResizableSplitView>
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
