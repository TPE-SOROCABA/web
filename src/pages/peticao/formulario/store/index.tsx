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

const petitionMock: PetitionForm = {
  id: "1",
  name: "João da Silva",
  protocol: "123456",
  pageOneUrl: "https://picsum.photos/600/600?random=1",
  pageTwoUrl: "https://picsum.photos/600/600?random=2",
  status: "PENDING",
  city: "São Paulo",
  phone: "11999999999",
  address: "Rua das Flores, 123",
  state: "SP",
  email: "joao.silva@example.com",
  languages: "PT",
  congregation: "Congregação",
  dateOfBaptism: "2021-01-01",
  dateOfBirth: "2001-01-01",
  avatarUrl: "https://picsum.photos/150/150",
  zipCode: "12345678",
  maritalStatus: "SINGLE",
  privileges: "ELDER",
  gender: "MALE",
};

export function PetitionFormProvider({ children }: StoreProviderProps) {
  const location = useLocation();
  const router = useNavigate();
  const tabs = useTabs();
  const [petition, setPetition] = useState<PetitionForm>(
    location.state?.petition ?? petitionMock
  );
  // if (!petition) {
  //   router(-1);
  //   return null;
  // }

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
