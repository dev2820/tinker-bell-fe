import { ComponentProps, forwardRef } from "react";
import type { Waiting } from "@/types/waiting";

import { cx } from "@/utils/styles/cx";
import { formatDate, ko } from "@/utils/date-time";

export type WaitingItemProp = ComponentProps<"div"> & {
  waiting: Waiting;
};

const WaitingConfirmItem = forwardRef<HTMLDivElement, WaitingItemProp>(
  function ({ waiting, className, ...props }, ref) {
    const title = formatDate(waiting.time, "yyyy.MM.dd (E)", { locale: ko });
    const time = formatDate(waiting.time, "a h:mm", { locale: ko });

    return (
      <div
        className={cx("flex flex-row gap justify-between py-4", className)}
        ref={ref}
        {...props}
      >
        <div>
          <strong className="text-base font-bold text-black leading-normal">
            {title}
          </strong>
          <p className="text-sm font-medium leading-normal text-neutral-400">
            {`${time} | ${waiting.participants.total}`}명
          </p>
        </div>
      </div>
    );
  }
);

WaitingConfirmItem.displayName = "WaitingConfirmItem";

export { WaitingConfirmItem };
