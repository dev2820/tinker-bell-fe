export const partition = <T = unknown>(
  items: T[],
  condition: (item: T) => boolean
) => {
  const initialValue: [T[], T[]] = [[], []];
  return items.reduce((prev, item) => {
    if (condition(item)) {
      return [[...prev[0], item], prev[1]] as [T[], T[]];
    } else {
      return [prev[0], [...prev[1], item]] as [T[], T[]];
    }
  }, initialValue);
};
