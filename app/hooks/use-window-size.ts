import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (): WindowSize => {
  const [screenSize, setScreenSize] = useState<WindowSize>({
    width: globalThis?.innerWidth ?? 0,
    height: globalThis?.innerHeight ?? 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: globalThis?.innerWidth,
        height: globalThis?.innerHeight,
      });
    };

    // 초기화 및 이벤트 리스너 등록
    globalThis?.addEventListener("resize", handleResize);

    // 클린업 함수로 이벤트 리스너 제거
    return () => {
      globalThis?.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};
