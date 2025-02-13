import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { useCookies } from "../../../lib";

interface PetitionContextProps {
  mode: Mode;
  searchProtocol: string;
  setSearchProtocol: Dispatch<SetStateAction<string>>;
  searchStatus: Status;
  setSearchStatus: Dispatch<SetStateAction<Status>>;
}

export const PetitionContext = createContext({} as PetitionContextProps);

interface StoreProviderProps {
  children: ReactNode;
}
type Status =
  | "CREATED"
  | "WAITING_INFORMATION"
  | "WAITING"
  | "ACTIVE"
  | "SUSPENDED"
  | "EXCLUDED"
  | "ALL";
type Mode = "analyst" | "coordinator";

export function PetitionProvider({ children }: StoreProviderProps) {
  const cookie = useCookies();
  const token = cookie.decodeToken();
  const mode = token?.profile === "COORDINATOR" ? "coordinator" : "analyst";
  const [searchProtocol, setSearchProtocol] = useState("");
  const [searchStatus, setSearchStatus] = useState<Status>("ALL");

  const debounce = (fn: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return function (...args: any) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  const updateSearchWithDebounce = debounce(setSearchProtocol, 500);

  return (
    <PetitionContext.Provider
      value={{
        mode,
        searchProtocol,
        setSearchProtocol: updateSearchWithDebounce,
        searchStatus,
        setSearchStatus,
      }}
    >
      {children}
    </PetitionContext.Provider>
  );
}
