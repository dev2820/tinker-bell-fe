export type Failed<E = Error> = {
  isFailed: true;
  value: null;
  error: E;
};
