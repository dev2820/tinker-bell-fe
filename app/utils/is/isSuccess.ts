import { Success } from "@/types/monad";
import { isResult } from "./isResult";

export const isSuccess = <T>(value: unknown): value is Success<T> => {
  return isResult(value) && value.isFailed === false;
};
