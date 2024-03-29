import type { CookieSetOptions } from "universal-cookie";
import { useCookies as useReactCookie } from "react-cookie";
import {jwtDecode} from "jwt-decode";

export interface IToken {
  id:          string;
  name:        string;
  profile:     string;
  groupId:     string;
  designation: Designation;
  iat:         number;
  exp:         number;
}

export interface Designation {
  id:         string;
  expiration: Date;
  name:       string;
}


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

  const decodeToken = (): IToken | null => {
    const token = get("token");
    if (!token) return null;
    return jwtDecode(token);
  }

  return { set, get, erase, decodeToken };
};

type Key = "token";
