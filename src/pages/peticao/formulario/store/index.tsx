import { createContext, ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IPetition } from "../../types";

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
      }}
    >
      {children}
    </PetitionFormContext.Provider>
  );
}
