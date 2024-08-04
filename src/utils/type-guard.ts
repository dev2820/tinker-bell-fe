export const isEmptyStr = (str: string) => {
  return Object.is(str, "");
};

export const isZero = (num: number) => {
  return Object.is(num, 0);
};

export const isNil = (value: unknown): value is null | undefined => {
  return Object.is(value, undefined) || Object.is(value, null);
};
