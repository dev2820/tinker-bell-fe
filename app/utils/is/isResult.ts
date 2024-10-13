import { Result } from "@/types/monad";
import { isObject } from "./isObject";

export const isResult = <T, E>(value: unknown): value is Result<T, E> => {
  if (!isObject(value)) {
    return false;
  }
  if (!Object.hasOwn(value, "isFailed")) {
    return false;
  }

  return true;
};
