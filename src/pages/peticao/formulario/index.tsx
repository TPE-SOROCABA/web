import { Button, Checkbox } from "@material-tailwind/react";
import { ImageFiles } from "../../../components";
import { BoxScreen } from "../../../components/box";
import { useCookies, useToast } from "../../../lib";
import { PetitionFormProvider } from "./store";
import { usePetitionFormStore } from "./store/useContextForm";
import { HandlerTabs } from "./Tabs";
import { useState } from "react";
import { useHttp } from "../useHttpDev";
import { useNavigate } from "react-router-dom";

export function FormularioPeticao() {
  return (
    <PetitionFormProvider>
      <ShowData />
    </PetitionFormProvider>
  );
}

const ShowData = () => {
  const cookie = useCookies();
  const token = cookie.decodeToken();
  const mode = token?.profile === "COORDINATOR" ? "coordinator" : "analyst";
  console.log(token);
  console.log(mode);
  const [checkedConfirmation, setCheckedConfirmation] = useState(false);
  const { petition } = usePetitionFormStore();
  const http = useHttp();
  const toast = useToast();
  const router = useNavigate();

  const disableSaveButton = mode === "coordinator" && !checkedConfirmation;

  const changeToWaitingInformation = async () => {
    if (mode !== "coordinator" || !petition?.id) return;
    console.log("changeToWaitingInformation: ", petition);
    try {
      await http.patch(`petitions/waiting-information/${petition?.id}`);
      toast.success("Petição alterada para aguardando informações", {
        duration: 5000,
        onClose: () => router("/peticao"),
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao alterar petição para aguardando informações", {
        duration: 5000,
      });
    }
  };

  const updatePetition = async () => {
    console.log("here", token);
    if (mode !== "analyst" || !petition?.id) return;

    console.log("updatePetition: ", petition);
    try {
      if (petition?.participants[0]?.id) {
        await http.put(
          `participants/${petition.participants[0]?.id}`,
          petition.participants[0]
        );
      } else {
        await http.post("participants", {
          ...petition.participants[0],
          petitionId: petition.id,
        });
      }
      toast.success("Petição atualizada com sucesso", {
        duration: 3000,
        onClose: () => router("/peticao"),
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar petição", {
        duration: 5000,
      });
    }
  };

  const submit = async () => {
    return mode === "coordinator"
      ? changeToWaitingInformation()
      : updatePetition();
  };

  return (
    <BoxScreen showBreadcrumbs background={mode === "analyst"}>
      <div className="grid grid-cols-2 gap-8">
        {mode === "coordinator" ? <Files /> : <HandlerTabs />}
        {mode === "analyst" && <File />}
      </div>
      <div className="grid grid-cols-2 gap-8">
        <span className={`${mode === "analyst" ? "invisible" : ""}`}>
          <Checkbox
            crossOrigin
            label="Todas as informações sigilosas foram devidamente preenchidas*"
            checked={checkedConfirmation}
            onChange={() => setCheckedConfirmation(!checkedConfirmation)}
          />
        </span>
        <div className="flex items-center justify-end gap-8">
          <Button
            placeholder={"Cancelar alterações"}
            className="rounded-3xl bg-red-600 px-11 py-4 w-48"
            onClick={() => router("/peticao")}
          >
            Cancelar
          </Button>
          <Button
            placeholder={"Salvar alterações"}
            className="rounded-3xl bg-primary-600 px-11 py-4 w-48"
            disabled={disableSaveButton}
            onClick={submit}
          >
            Salvar
          </Button>
        </div>
      </div>
    </BoxScreen>
  );
};

const File = () => {
  const { petition } = usePetitionFormStore();

  return <ImageFiles contents={[petition?.publicUrl]} />;
};
const Files = () => {
  const { petition } = usePetitionFormStore();

  return (
    <>
      <ImageFiles contents={[petition?.publicUrl]} />
      <ImageFiles contents={[petition?.privateUrl]} />
    </>
  );
};
