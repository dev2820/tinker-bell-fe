import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ButtonProps, IconButton } from "terra-design-system/react";

type FloatingButtonProps = ButtonProps & VariantProps<typeof buttonStyle>;
export function FloatingButton(props: FloatingButtonProps) {
  const { className, shape = "square", ...rest } = props;

  return (
    <IconButton
      theme="primary"
      className={cn(buttonStyle({ shape }), className)}
      {...rest}
    />
  );
}

const buttonStyle = cva(
  "fixed bottom-6 right-6 w-16 h-16 inline-flex justify-center place-items-center shadow-cta",
  {
    variants: {
      shape: {
        round: "rounded-full",
        square: "rounded-2xl",
      },
    },
  }
);
