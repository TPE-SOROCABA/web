import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IPetition } from "../../types";
import { useTabs } from "./useTabs";

interface PetitionFormContextProps {
  petition: IPetition;
  availableTabs: string[];
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
}

export const PetitionFormContext = createContext(
  {} as PetitionFormContextProps
);

interface StoreProviderProps {
  children: ReactNode;
}
export function PetitionFormProvider({ children }: StoreProviderProps) {
  const location = useLocation();
  const router = useNavigate();
  const tabs = useTabs();
  const [petition, setPetition] = useState<IPetition>(location.state?.petition);
  if (!petition) {
    router(-1);
    return null;
  }
  return (
    <PetitionFormContext.Provider
      value={{
        petition,
        ...tabs,
      }}
    >
      {children}
    </PetitionFormContext.Provider>
  );
}
