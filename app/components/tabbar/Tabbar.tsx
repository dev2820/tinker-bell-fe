import { cn } from "@/utils/cn";
import { ComponentProps } from "react";

type TabbarProps = ComponentProps<"menu">;
export function Tabbar(props: TabbarProps) {
  const { className, children, ...rest } = props;
  return (
    <menu
      className={cn(
        "h-menubar z-10 border-t border-gray-200 rounded-t-xl flex flex-row place-items-stretch justify-stretch p-2",
        className
      )}
      {...rest}
    >
      {children}
    </menu>
  );
}
