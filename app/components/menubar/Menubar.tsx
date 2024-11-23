import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type MenubarProps = ComponentProps<"div">;
export function Menubar(props: MenubarProps) {
  const { className, children, ...rest } = props;
  return (
    <div
      className={cn(
        "z-10 border-t border-gray-200 rounded-t-xl flex flex-row gap-2 place-items-stretch p-2",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
