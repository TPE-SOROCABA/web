import type { CookieSetOptions } from "universal-cookie";
import { useCookies as useReactCookie } from "react-cookie";

export const useCookies = () => {
  const [cookies, setReactCookie, removeReactCookie] = useReactCookie();

  const set = (name: Key, value: string, options?: CookieSetOptions) => {
    setReactCookie(name, value, options);
  };

  const get = (name: Key) => {
    return cookies[name];
  };

  const erase = (name: Key) => {
    removeReactCookie(name);
  };

  return { set, get, erase };
};

type Key = "token";
