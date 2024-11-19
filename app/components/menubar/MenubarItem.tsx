import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";

type MenubarItemProps = Omit<ComponentProps<"div">, "children"> & {
  icon: ReactNode;
  labelText: string;
};

export function MenubarItem(props: MenubarItemProps) {
  const { icon, labelText, className, ...rest } = props;
  return (
    <div
      className={cn("inline-flex flex-col place-items-center", className)}
      {...rest}
    >
      {icon}
      <span className="text-xs mt-1">{labelText}</span>
    </div>
  );
}
