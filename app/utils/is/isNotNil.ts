import { isNil } from "./isNil";

export const isNotNil = (value: unknown) => {
  return !isNil(value);
};
