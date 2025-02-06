import { useThemeStore } from "@/stores/theme";
import { NavigateFunction } from "@remix-run/react";

const isApp = () => {
  return typeof window !== "undefined" && window.ReactNativeWebView;
};

export const sendCookie = (): void => {
  if (isApp()) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "COOKIE", cookies: document.cookie })
    );
  }
};

export const clearAppCookie = (): void => {
  if (isApp()) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "COOKIE", cookies: "" })
    );
  }
};
const sendRouterEvent = (path: string): void => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "ROUTER_EVENT", path: path })
  );
};

export const sendChangeTheme = (): void => {
  if (isApp()) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: "CHANGE_THEME",
        theme: useThemeStore.getState().theme,
      })
    );
  }
};

export const sendModalOpenEvent = (): void => {
  if (isApp()) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "OPEN_MODAL" })
    );
  }
};
export const sendModalCloseEvent = (): void => {
  if (isApp()) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "CLOSE_MODAL" })
    );
  }
};

export const routerBack = (navigate: NavigateFunction) => {
  if (isApp()) {
    sendRouterEvent("back");
  } else {
    navigate(-1);
  }
};

export const routerPush = (navigate: NavigateFunction, url: string) => {
  if (isApp()) {
    sendRouterEvent(url);
  } else {
    navigate(url);
  }
};
