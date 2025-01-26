import axios from "axios";

// const MOCK = {

export const useHttp = () => {
  const http = axios.create({
    baseURL: "https://server.tpedigital.com.br",
  });

  return http;
};
