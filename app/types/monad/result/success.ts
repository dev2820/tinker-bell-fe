export type Success<T = unknown> = {
  isFailed: false;
  value: T;
  error: null;
};
