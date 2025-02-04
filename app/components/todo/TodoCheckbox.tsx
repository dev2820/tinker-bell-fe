import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon } from "lucide-react";
import { ComponentProps } from "react";

export type TodoCheckboxProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof todoCheckboxStyle>;

export function TodoCheckbox(props: TodoCheckboxProps) {
  const { className, size, ...rest } = props;
  const iconSize = size === "sm" ? 12 : size === "md" ? 14 : 16;

  return (
    <label
      className={cn("inline-flex place-items-center justify-center", className)}
    >
      <input type="checkbox" className={cn("peer hidden")} {...rest} />
      <div className={cn(todoCheckboxStyle({ size }))}>
        <CheckIcon
          size={iconSize}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
        />
      </div>
    </label>
  );
}

const todoCheckboxStyle = cva(
  [
    "relative",
    "rounded-full",
    "border border-gray-400 peer-checked:border-primary",
    "text-transparent peer-checked:text-primary-foreground",
    "peer-checked:bg-primary",
  ],
  {
    variants: {
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);
