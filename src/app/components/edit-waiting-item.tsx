import { ComponentProps, forwardRef } from "react";
import type { Waiting } from "@/types/waiting";

import { cx } from "@/utils/styles/cx";
import { ChevronRightIcon } from "lucide-react";
import { formatDate, ko } from "@/utils/date-time";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type WaitingItemProp = ComponentProps<"div"> & {
  waiting: Waiting;
};

const EditWaitingItem = forwardRef<HTMLDivElement, WaitingItemProp>(function (
  { waiting, className, ...props },
  ref
) {
  const title = formatDate(waiting.time, "yyyy.MM.dd (E)", { locale: ko });
  const time = formatDate(waiting.time, "a h:mm", { locale: ko });

  return (
    <div
      className={cx(
        "flex flex-row gap justify-between py-4",
        waiting.status === "done" ? "opacity-50" : "",
        className
      )}
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
      {waiting.status === "done" && (
        <Button variant="default">이미 완료된 행사</Button>
      )}
      {waiting.status === "planned" && (
        <Button variant="outline">행사 수정하기</Button>
      )}
    </div>
  );
});

EditWaitingItem.displayName = "EditWaitingItem";

export { EditWaitingItem };
