import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "terra-design-system/react";

type RoundButtonProps = ButtonProps;
export function RoundButton(props: RoundButtonProps) {
  const { className, ...rest } = props;

  return (
    <Button
      theme="primary"
      className={cn(
        "rounded-full h-14 w-14 inline-flex justify-center place-items-center shadow-md",
        className
      )}
      {...rest}
    />
  );
}
