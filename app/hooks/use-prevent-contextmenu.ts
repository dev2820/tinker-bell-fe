import { useEffect } from "react";

export function usePreventContextMenu() {
  useEffect(() => {
    const disableContextmenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", disableContextmenu);

    return () => {
      document.removeEventListener("contextmenu", disableContextmenu);
    };
  });
}
