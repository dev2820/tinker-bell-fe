import { cn } from "@/utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { Button, ButtonProps } from "terra-design-system/react";

type CTAButtonProps = ButtonProps & VariantProps<typeof buttonStyle>;
export function CTAButton(props: CTAButtonProps) {
  const { className, shape = "square", ...rest } = props;

  return (
    <Button
      theme="primary"
      className={cn(buttonStyle({ shape }), className)}
      {...rest}
    />
  );
}

const buttonStyle = cva(
  [
    "inline-flex justify-center place-items-center shadow-cta",
    "active:scale-[0.9]",
  ],
  {
    variants: {
      shape: {
        round: "rounded-full",
        square: "rounded-2xl w-full",
      },
    },
  }
);
