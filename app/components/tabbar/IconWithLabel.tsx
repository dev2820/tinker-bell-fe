import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type IconWithLabelProps = ComponentProps<"div"> & {
  labelText: string;
};

export function IconWithLabel(props: IconWithLabelProps) {
  const { children, labelText, className, ...rest } = props;
  return (
    <div
      className={cn("inline-flex flex-col place-items-center", className)}
      {...rest}
    >
      {children}
      <span className="text-xs mt-1">{labelText}</span>
    </div>
  );
}
