import { ComponentProps, forwardRef } from "react";
import type { Promotion } from "@/types/promotion";

import { cx } from "@/utils/styles/cx";
import { ChevronRightIcon } from "lucide-react";
import { formatDate } from "@/utils/date-time";

export type PromotionItemProp = ComponentProps<"div"> & {
  promotion: Promotion;
  inProgress?: boolean;
};

const PromotionItem = forwardRef<HTMLDivElement, PromotionItemProp>(function (
  { promotion, inProgress = false, className, ...props },
  ref
) {
  return (
    <div
      className={cx("flex flex-row gap justify-between py-4", className)}
      ref={ref}
      {...props}
    >
      <div>
        <strong className="text-base font-bold text-black leading-normal">
          {promotion.title}
        </strong>
        <p className="text-sm font-medium leading-normal text-neutral-400">
          {formatDate(promotion.duration.start, "yyyy.MM.dd")} ~
          {formatDate(promotion.duration.end, "yyyy.MM.dd")}
        </p>
      </div>
      <ChevronRightIcon
        size={32}
        className={inProgress ? "text-primary" : "text-neutral-400"}
      />
    </div>
  );
});

PromotionItem.displayName = "PromotionItem";

export { PromotionItem };
