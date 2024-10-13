import { Failed } from "@/types/monad";
import { isResult } from "./isResult";

export const isFailed = <E>(result: unknown): result is Failed<E> => {
  return isResult(result) && result.isFailed === true;
};
