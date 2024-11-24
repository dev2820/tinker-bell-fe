import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type MenubarProps = ComponentProps<"menu">;
export function Menubar(props: MenubarProps) {
  const { className, children, ...rest } = props;
  return (
    <menu
      className={cn(
        "h-menubar z-10 border-t border-gray-200 rounded-t-xl flex flex-row gap-2 place-items-stretch justify-stretch p-2",
        className
      )}
      {...rest}
    >
      {children}
    </menu>
  );
}
