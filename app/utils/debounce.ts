// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    // 기존 타이머를 클리어
    if (timeout !== null) {
      console.log("hit, clear");
      clearTimeout(timeout);
    }

    // 새로운 타이머 설정
    timeout = setTimeout(() => {
      console.log("timeout, run");
      func(...args);
    }, wait);
  };
}
