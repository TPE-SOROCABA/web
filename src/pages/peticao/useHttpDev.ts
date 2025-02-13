import axios from "axios";
const http = axios.create({
  baseURL: "https://server.tpedigital.com.br",
});

export const useHttp = () => {
  return http;
};
