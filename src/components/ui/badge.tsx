import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cx } from "@/utils/styles/cx";

const badgeVariants = cva(
  [
    "inline-flex items-center rounded-full border h-8 text-xs font-medium transition-colors",
    "px-2.5 leading-normal text-base",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        primary: "border-transparent bg-primary text-primary-foreground",
        neutral: "border-transparent bg-neutral-300 text-white",
        outline: "border-primary text-primary",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cx(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
