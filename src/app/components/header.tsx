import { ComponentProps, ReactNode } from "react";

import logo from "../../public/assets/images/logo.svg";
import { Spacer } from "@/components/ui/spacer";
import { cx } from "@/utils/styles/cx";

export type HeaderProps = ComponentProps<"header"> & {
  leading?: ReactNode;
  trailing?: ReactNode;
};
export function Header({
  leading,
  trailing,
  className,
  children,
  ...props
}: HeaderProps) {
  return (
    <header
      className={cx(
        "h-12 w-full block items-center text-neutral-300 relative text-center leading-[48px]",
        className
      )}
      {...props}
    >
      {leading && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          {leading}
        </div>
      )}
      {children}
      {trailing && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {trailing}
        </div>
      )}
    </header>
  );
}
