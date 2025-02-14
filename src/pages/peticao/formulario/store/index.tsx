import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IPetition } from "../../types";
import { useHttp } from "../../useHttpDev";

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
  congregations: ICongregations[];
}

interface ICongregations {
  city: string;
  id: number;
  name: string;
  state: string;
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
  const http = useHttp();
  const [petition, setPetition] = useState<PetitionForm>(
    location.state?.petition
  );
  const [congregations, setCongregations] = useState<ICongregations[]>([]);

  const listCongregations = useCallback(async () => {
    try {
      const response = await http.get("congregations");
      setCongregations(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [http]);

  useEffect(() => {
    listCongregations();
  }, [listCongregations]);

  if (!petition) {
    router(-1);
    return null;
  }

  const updatePetition = ({ name, value }: { name: string; value: any }) => {
    setPetition((prev) => {
      const participants = prev.participants.map((participant) => {
        return {
          ...participant,
          [name]: value,
        };
      });
      return {
        ...prev,
        participants,
      };
    });

    if (name === "email") {
      findByEmailWithDebounce(value);
    }
  };

  const findByEmail = async (email: string) => {
    try {
      const { data } = await http.get(`participants/emails/${email}`);
      setPetition((prev) => ({
        ...prev,
        participants: [data],
      }));
    } catch (error: any) {
      console.error(error);
      const status = error.response?.status;
      if (status === 404) {
        setPetition((prev) => ({
          ...prev,
          participants: [
            {
              ...prev.participants[0],
              id: "",
            },
          ],
        }));
      }
    }
  };
  const findByEmailWithDebounce = debounce(findByEmail, 1000);

  return (
    <PetitionFormContext.Provider
      value={{
        petition,
        updatePetition,
        congregations,
      }}
    >
      {children}
    </PetitionFormContext.Provider>
  );
}

let timeoutId: NodeJS.Timeout;
const debounce = (fn: Function, delay: number) => {
  return function (...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
