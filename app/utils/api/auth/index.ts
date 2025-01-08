import { authAPI } from "..";
import Cookies from "js-cookie";

export function logout() {
  return authAPI.get("oauth/logout", {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
}
