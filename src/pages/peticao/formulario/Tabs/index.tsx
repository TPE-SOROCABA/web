import {
  Accordion,
  AccordionBody,
  AccordionHeader,
} from "@material-tailwind/react";

import { useState } from "react";
import { Perfil } from "./Perfil";
import { Congregacao } from "./Congregacao";
import { Disponibilidade } from "./Disponibilidade";
import { usePetitionFormStore } from "../store/useContextForm";
import { useToast } from "src/lib";
import { UploadImage } from "@/components/index";
import { ChevronDown } from "lucide-react";
import { useHttp } from "../../useHttpDev";

const tabs = [
  { component: <Perfil />, label: "Pessoal" },
  { component: <Congregacao />, label: "Espiritual" },
  { component: <Disponibilidade />, label: "Outros" },
];

export function HandlerTabs() {
  const [tab, setTab] = useState(0);
  const { petition, updatePetition } = usePetitionFormStore();
  const http = useHttp();
  const toast = useToast();

  const handleUploadImage = async (image: string | Blob | null) => {
    try {
      if (!image) {
        toast.error("Imagem não selecionada", {
          duration: 3000,
        });
        return;
      }
      const formData = new FormData();
      formData.append('file', image);
      await http.post(`/participants/${petition.participants[0]?.id}/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Imagem alterada com sucesso", {
        duration: 3000,
      });
      const imageUrl = image instanceof Blob ? URL.createObjectURL(image) : image;
      updatePetition({ name: "profilePhoto", value: imageUrl });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao alterar a imagem", {
        duration: 3000,
      });
    }
  };
  return (
    <div className="flex flex-col col-span-1 gap-8">
      <div
        className="col-span-2 w-fit"
      >
        <UploadImage
          img={petition.participants[0]?.profilePhoto || ""}
          handleDeleteImage={handleUploadImage}
          setImage={handleUploadImage}
          className={`${!petition.participants[0]?.id ? "pointer-events-none" : ""}`}
          participantId={petition.participants[0]?.id || ""}
        />
      </div>
      {tabs.map((item, index) => (
        <Accordion placeholder="" open={index === tab} key={index} icon={<ChevronDown className={`transition-transform ${index === tab ? "rotate-180" : ""}`} />}>
          <AccordionHeader
            placeholder=""
            onClick={() => setTab(index === tab ? -1 : index)}
            className="bg-[#FAFAFA] rounded-lg p-2 border-none shadow-md"

          >
            <div className="flex items-center">
              <span>{item.label}</span>
            </div>
          </AccordionHeader>
          <AccordionBody>{tab === index && item.component}</AccordionBody>
        </Accordion>
      ))}
    </div>
  );
}
