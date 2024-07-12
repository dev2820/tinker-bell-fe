import { cx } from "@/utils/styles/cx";
import { ComponentProps, forwardRef } from "react";
import { PurchaseHistory } from "../types/purchase-history";
import { formatDate } from "@/utils/date-time";
import { ArrowRightIcon } from "lucide-react";
import { text } from "@/utils/styles/patterns";

export type PurchaseHistoryItemProps = Omit<
  ComponentProps<"div">,
  "children"
> & {
  history: PurchaseHistory;
};

const PurchaseHistoryItem = forwardRef<
  HTMLDivElement,
  PurchaseHistoryItemProps
>(function (props, ref) {
  const { className, history, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cx("rounded-sm p-4 bg-card", className)}
      {...rest}
    >
      <div className="flex flex-row justify-between mb-1">
        <b>{formatDate(history.date, "yy.MM.dd")}</b>
        <span
          className={cx(
            text.caption({ weight: "medium", className: "text-neutral-300" }),
            "inline-flex flex-row gap-1 items-center"
          )}
        >
          <span>구매 상세</span>
          <ArrowRightIcon size={16} />
        </span>
      </div>
      <p>{history.title}</p>
    </div>
  );
});

PurchaseHistoryItem.displayName = "PurchaseHistoryItem";

export { PurchaseHistoryItem };
