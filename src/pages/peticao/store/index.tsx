import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { useCookies, debounce } from "src/lib";

interface PetitionContextProps {
  mode: Mode;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  searchStatus: Status;
  setSearchStatus: Dispatch<SetStateAction<Status>>;
}

export const PetitionContext = createContext({} as PetitionContextProps);

interface StoreProviderProps {
  children: ReactNode;
}
export type Status =
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
  const [search, setSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState<Status>(mode === "analyst" ? "WAITING_INFORMATION" : "ALL");

  const updateSearchWithDebounce = debounce(setSearch, 500);

  return (
    <PetitionContext.Provider
      value={{
        mode,
        search,
        setSearch: updateSearchWithDebounce,
        searchStatus,
        setSearchStatus,
      }}
    >
      {children}
    </PetitionContext.Provider>
  );
}
