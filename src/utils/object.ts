export function pick<T extends Object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((pickedObj, key) => {
    if (key in obj) {
      pickedObj[key] = obj[key];
    }
    return pickedObj;
  }, {} as Pick<T, K>);
}
