import axios from "axios";

const TEN_SECONDS_MS = 10000;
const timeout = TEN_SECONDS_MS;
export const http = axios.create({
  baseURL: "https://api.tpedigital.com.br/dev",
  timeout,
});

export type Http = typeof http;
