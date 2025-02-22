import { cn } from "@/utils/cn";
import { ComponentProps, ReactNode } from "react";

type MenuItemProps = ComponentProps<"button"> & { icon: ReactNode };
export const MenuItem = (props: MenuItemProps) => {
  const { children, icon, className, ...rest } = props;
  return (
    <button
      className={cn(
        className,
        "px-4 w-full h-12 text-start hover:bg-layer-hover active:bg-layer-pressed duration-300 transition-colors",
        "flex flex-row items-center gap-2"
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};
