import { cx } from "@/utils/cx";
import { ComponentProps } from "react";

export type TodoTitleInputProps = ComponentProps<"input">;

export function TodoTitleInput(props: TodoTitleInputProps) {
  const { className, ...rest } = props;

  return (
    <input
      type="text"
      className={cx(
        "focus:outline-none bg-white text-black text-lg",
        className
      )}
      {...rest}
    />
  );
}
