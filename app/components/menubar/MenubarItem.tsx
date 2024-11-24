import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type MenubarItemProps = ComponentProps<"li">;
export function MenubarItem(props: MenubarItemProps) {
  const { className, children, ...rest } = props;
  return (
    <li className={cn("flex-1", className)} {...rest}>
      {children}
    </li>
  );
}
