import { NavigateFunction } from "@remix-run/react";

const isApp = () => {
  return typeof window !== "undefined" && window.ReactNativeWebView;
};

const sendRouterEvent = (path: string): void => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "ROUTER_EVENT", path: path })
  );
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
