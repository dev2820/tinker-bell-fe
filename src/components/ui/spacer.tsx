import React, { type ComponentProps } from "react";

export type SpacerProps = ComponentProps<"div">;
export function Spacer({ className, ...props }: SpacerProps) {
  return <div className={`flex-1 ${className}`} {...props} />;
}
