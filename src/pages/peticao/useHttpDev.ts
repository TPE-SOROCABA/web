import axios from "axios";
const http = axios.create({
  // baseURL: "https://server.tpedigital.com.br",
  baseURL: "https://e1b3-187-180-189-119.ngrok-free.app",
});

export const useHttp = () => {
  return http;
};
