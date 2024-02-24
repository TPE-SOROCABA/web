import type { CookieSetOptions } from "universal-cookie";
import { useCookies as useReactCookie } from "react-cookie";

export const useCookies = () => {
  const [cookies, setReactCookie, removeReactCookie] = useReactCookie();

  const setCookie = (
    name: string,
    value: string,
    options?: CookieSetOptions
  ) => {
    setReactCookie(name, value, options);
  };

  const getCookie = (name: string) => {
    return cookies[name];
  };

  const eraseCookie = (name: string) => {
    removeReactCookie(name);
  };

  return { setCookie, getCookie, eraseCookie };
};
