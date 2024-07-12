import { cx } from "@/utils/styles/cx";
import { ComponentProps, forwardRef } from "react";
import { text } from "@/utils/styles/patterns";
export type SettingMenuItemProps = ComponentProps<"div">;

export const SettingMenuItem = forwardRef<HTMLDivElement, SettingMenuItemProps>(
  function (props, ref) {
    const { children, className, ...rest } = props;
    return (
      <div
        ref={ref}
        className={cx(
          text.title2({ weight: "bold", className: "text-neutral-300" }),
          "rounded-sm p-4 bg-card",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

SettingMenuItem.displayName = "SettingMenuItem";
