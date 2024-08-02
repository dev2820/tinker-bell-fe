import { cx } from "@/utils/styles/cx";
import { text } from "@/utils/styles/patterns";
import { InfoIcon } from "lucide-react";
import { ComponentProps } from "react";

export type InfoTextProps = ComponentProps<"span">;

export function InfoText({ children }: InfoTextProps) {
  return (
    <span
      className={cx(
        "inline-flex flex-row gap-1 place-items-center text-neutral-400",
        text.caption({ weight: "light" })
      )}
    >
      <InfoIcon size={16} />
      {children}
    </span>
  );
}
