import axios from "axios";

export const useHttp = () => {
  const http = axios.create({
    baseURL: "https://b173-187-180-188-14.ngrok-free.app/api",
  });

  return http;
};
