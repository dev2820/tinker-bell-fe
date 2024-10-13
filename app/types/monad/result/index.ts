import { Failed } from "./failed";
import { Success } from "./success";

export type { Failed } from "./failed";
export type { Success } from "./success";
export type Result<T, E> = Success<T> | Failed<E>;
