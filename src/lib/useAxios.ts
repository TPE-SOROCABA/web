import { useCookies } from ".";
import { http } from "../infra";

export const useHttp = () => {
  const cookie = useCookies();

  http.interceptors.request.use((config) => {
    const token = cookie.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return http;
};
