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
import { useCookies, useToast } from "src/lib";

type Mode = "analyst" | "coordinator";

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
  handleUploadImage: (image: string | Blob | null, participantId: string) => Promise<void>;
  retryUploadImage: { formData: FormData, image: string | Blob | null } | null;
  retryUpload: (participantId: string) => Promise<void>;
  mode: Mode;
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
  const cookie = useCookies();
  const token = cookie.decodeToken();
  const mode = token?.profile === "COORDINATOR" ? "coordinator" : "analyst";
  const http = useHttp();
  const toast = useToast();
  const [petition, setPetition] = useState<PetitionForm>(
    location.state?.petition
  );
  const [congregations, setCongregations] = useState<ICongregations[]>([]);
  const [retryUploadImage, setRetryUploadImage] = useState<{ formData: FormData, image: string | Blob | null } | null>(null);

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
      const participants = prev.participants?.length ? prev.participants.map((participant) => {
        return {
          ...participant,
          [name]: value,
        };
      }) : [
        {
          [name]: value,
        }
      ] as any
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

  const handleUploadImage = async (image: string | Blob | null, participantId: string) => {
    if (!image) {
      toast.error("Imagem não selecionada", {
        duration: 3000,
      });
      return;
    }
    const formData = new FormData();
    formData.append('file', image);
    uploadImage(formData, image, participantId);
  };
  const retryUpload = async (participantId: string) => {
    if (!retryUploadImage) return;
    await uploadImage(retryUploadImage.formData, retryUploadImage.image, participantId);
  }

  const uploadImage = async (formData: FormData, image: string | Blob | null, participantId: string) => {
    const imageUrl = image instanceof Blob ? URL.createObjectURL(image) : image;
    try {
      const {data} = await http.post(`/participants/${participantId}/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Imagem alterada com sucesso", {
        duration: 3000,
      });

      const profilePhoto = data?.profilePhoto;
      if (profilePhoto) {
        updatePetition({ name: "profilePhoto", value: profilePhoto });
      }
    } catch (error) {
      console.log(error);
      const participant = petition?.participants[0]?.id;
      if (retryUploadImage !== null && participant) {
        toast.error("Erro ao alterar a imagem", {
          duration: 3000,
        });
      }
      updatePetition({ name: "profilePhoto", value: imageUrl });
      setRetryUploadImage({
        formData,
        image
      });
    }
  }

  return (
    <PetitionFormContext.Provider
      value={{
        petition,
        updatePetition,
        congregations,
        handleUploadImage,
        retryUploadImage,
        retryUpload,
        mode,
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
