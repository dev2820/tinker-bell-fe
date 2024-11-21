import { useRef, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>): void => {
      // 기존 타이머를 클리어
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      // 새로운 타이머 설정
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, wait);
    },
    [func, wait] // func와 wait이 변경되면 새로운 debounce 함수 생성
  );
}
