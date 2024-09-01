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

export interface PetitionForm extends IPetition {
  avatarUrl: string;
  address: string;
  zipCode: string;
  maritalStatus: string;
  privileges: string;
}

interface PetitionFormContextProps {
  petition: PetitionForm;
  updatePetition: ({ name, value }: { name: string; value: any }) => void;
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
  const [petition, setPetition] = useState<PetitionForm>(
    location.state?.petition
  );
  if (!petition) {
    router(-1);
    return null;
  }

  const updatePetition = ({ name, value }: { name: string; value: any }) => {
    setPetition((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <PetitionFormContext.Provider
      value={{
        petition,
        updatePetition,
        ...tabs,
      }}
    >
      {children}
    </PetitionFormContext.Provider>
  );
}
