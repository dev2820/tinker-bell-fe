import { Button } from "@/components/ui/button";
import { cx } from "@/utils/styles/cx";
import {
  type ElementRef,
  type ComponentPropsWithoutRef,
  forwardRef,
} from "react";

const CTAButton = forwardRef<
  ElementRef<typeof Button>,
  ComponentPropsWithoutRef<typeof Button>
>(function ({ className, ...props }, ref) {
  return (
    <Button
      className={cx(
        "h-16 font-bold leading-snug text-xl shadow-1 fixed bottom-8 w-[calc(100%_-_32px)]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

CTAButton.displayName = "CTAButton";

export { CTAButton };
