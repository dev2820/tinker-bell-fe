import { NavigateFunction } from "@remix-run/react";
import Cookies from "js-cookie";
const isApp = () => {
  return typeof window !== "undefined" && window.ReactNativeWebView;
};

export const sendCookie = (): void => {
  const accessToken = Cookies.get("accessToken");

  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "COOKIE", cookies: accessToken })
  );
};
const sendRouterEvent = (path: string): void => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "ROUTER_EVENT", path: path })
  );
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
