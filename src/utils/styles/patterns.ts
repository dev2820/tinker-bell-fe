import { cva } from "class-variance-authority";

export const text = {
  title2: cva("text-lg leading-snug", {
    variants: {
      weight: {
        light: "font-thin",
        medium: "font-normal",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      weight: "medium",
    },
  }),
  caption: cva("text-sm leading-normal", {
    variants: {
      weight: {
        light: "font-thin",
        medium: "font-normal",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      weight: "medium",
    },
  }),
};
