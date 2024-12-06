import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type TabItemProps = ComponentProps<"li">;
export function TabItem(props: TabItemProps) {
  const { className, children, ...rest } = props;

  return (
    <li className={cn("flex-1", className)} {...rest}>
      {children}
    </li>
  );
}
