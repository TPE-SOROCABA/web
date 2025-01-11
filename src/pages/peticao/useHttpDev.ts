import { IPetition } from "./types";

const petitions: IPetition[] = [
  {
    id: "1",
    name: "Maria",
    protocol: "123",
    pageOneUrl: "https://www.google.com",
    pageTwoUrl: "https://www.google.com",
    status: "PENDING",
    city: "São Paulo",
    phone: "11999999999",
    state: "SP",
    email: "maria.example@example.com",
    languages: "PT",
    congregation: "Congregação",
    dateOfBaptism: "2021-01-01",
    dateOfBirth: "2001-01-01",
    gender: "FEMALE",
  },
  {
    id: "2",
    name: "João",
    protocol: "124",
    pageOneUrl: "https://www.google.com",
    pageTwoUrl: "https://www.google.com",
    status: "PENDING",
    city: "São Paulo",
    phone: "11999999999",
    state: "SP",
    email: "joao.example@example.com",
    languages: "PT",
    congregation: "Congregação",
    dateOfBaptism: "2021-01-01",
    dateOfBirth: "2001-01-01",
    gender: "MALE",
  },
];

const MOCK = {
  "/petition": { data: petitions },
};

export const useHttp = () => {
  // const http = axios.create({
  //   baseURL: "https://b173-187-180-188-14.ngrok-free.app/api",
  // });

  // return http;
  return {
    get: async (path: keyof typeof MOCK) => MOCK[path],
  };
};
