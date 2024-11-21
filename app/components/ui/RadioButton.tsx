import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type RadioButtonProps = ComponentProps<"label"> & {
  name?: string;
  value?: string;
  checked?: boolean;
};

export function RadioButton(props: RadioButtonProps) {
  const { className, name, value, checked, children, ...rest } = props;
  return (
    <label className={cn("cursor-pointer", className)} {...rest}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        aria-checked={checked}
        className="hidden"
      />
      <div
        className={`px-4 py-2 rounded-md border transition-colors ${
          checked
            ? "bg-blue-500 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-300"
        } hover:bg-blue-100`}
      >
        {children}
      </div>
    </label>
  );
}
