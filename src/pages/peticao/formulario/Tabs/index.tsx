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
import { UploadImage } from "@/components/index";
import { ChevronDown } from "lucide-react";
import dayjs from "dayjs";

const tabs = [
  { component: <Perfil />, label: "Pessoal" },
  { component: <Congregacao />, label: "Espiritual" },
  { component: <Disponibilidade />, label: "Outros" },
];

export function HandlerTabs() {
  const [tab, setTab] = useState(0);
  const { petition, handleUploadImage, mode } = usePetitionFormStore();
  const statusIsCreated = petition?.status === "CREATED";
  const isAnalyst = mode === "analyst";
  const disableInputs = isAnalyst && statusIsCreated;

  const birthDate = petition?.participants[0]?.birthDate;
  console.log("birthDate", birthDate);  
  const dateBirth = dayjs(birthDate);
  const age = dayjs().diff(dateBirth, "year");
  return (
    <div className="flex flex-col col-span-1 gap-8">
      <div className="flex items-center justify-between gap-10">
        <div
          className="w-fit relative"
        >
          <UploadImage
            img={petition?.participants[0]?.profilePhoto || ""}
            handleDeleteImage={() => handleUploadImage(null, petition?.participants[0]?.id || "")}
            setImage={(image) => handleUploadImage(image, petition?.participants[0]?.id || "")}
            className={`${!petition?.participants[0]?.id ? "pointer-events-none" : ""}`}
            participantId={petition?.participants[0]?.id || ""}
          />
          {disableInputs && (
            <div className="absolute top-0 left-0 w-full h-full bg-black/10 rounded-full cursor-not-allowed select-none" />
          )}
        </div>


        <span className="text-lg font-bold underline text-gray-700" hidden={age > 16 || !birthDate}>
          Menor de Idade
        </span>
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
