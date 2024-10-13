import Cookies from "js-cookie";

export const getCookie = (key: string) => {
  return Cookies.get(key) ?? null;
};
