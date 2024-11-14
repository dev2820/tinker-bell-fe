import Cookies from "js-cookie";

export const getCookie = (key: string) => {
  return Cookies.get(key) ?? null;
};

export const deleteCookie = (key: string) => {
  Cookies.remove(key, { path: "/", domain: ".ticketbell.store" });
};
