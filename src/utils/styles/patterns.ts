import { cva } from "class-variance-authority";

export const text = {
  title1: cva("text-xl leading-snug", {
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
  body: cva("text-md leading-normal", {
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
