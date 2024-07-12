import { ComponentProps, forwardRef } from "react";
import type { Waiting } from "@/types/waiting";

import { cx } from "@/utils/styles/cx";
import { ChevronRightIcon } from "lucide-react";
import { formatDate, ko } from "@/utils/date-time";
import { Badge } from "@/components/ui/badge";

export type WaitingItemProp = ComponentProps<"div"> & {
  waiting: Waiting;
};

const WaitingItem = forwardRef<HTMLDivElement, WaitingItemProp>(function (
  { waiting, className, ...props },
  ref
) {
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
          {`${time} | ${waiting.participants.current}/${waiting.participants.total}`}
        </p>
      </div>
      {waiting.status === "done" && <Badge variant="neutral">진행 완료</Badge>}
      {waiting.status === "in-progress" && (
        <Badge variant="primary">현재 진행중</Badge>
      )}
      {waiting.status === "planned" && (
        <Badge variant="outline">진행 예정</Badge>
      )}
    </div>
  );
});

WaitingItem.displayName = "WaitingItem";

export { WaitingItem };
