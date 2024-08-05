import Cookies from "js-cookie";

/**
 * Cookie handling done here
 * @param uid unique user id
 */
export function addLoginCookie(uid) {
  Cookies.set("uid", uid);
}

export function removeLoginCookie() {
  Cookies.remove("uid");
}

export function getLoginCookie() {
  return Cookies.get("uid");
}
