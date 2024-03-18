import axios from "axios";

const TEN_SECONDS_MS = 10000;
const timeout = TEN_SECONDS_MS;
export const http = axios.create({
  baseURL: "https://api-dev.tpedigital.com.br",
  timeout,
});

export type Http = typeof http;
