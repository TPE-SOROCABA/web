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
  const [checkedConfirmation, setCheckedConfirmation] = useState(false);
  const { petition, retryUploadImage, retryUpload } = usePetitionFormStore();
  const http = useHttp();
  const toast = useToast();
  const router = useNavigate();

  const disableSaveButton = mode === "coordinator" && !checkedConfirmation;

  const changeToWaitingInformation = async () => {
    if (mode !== "coordinator" || !petition?.id) return;
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
    if (mode !== "analyst" || !petition?.id) return;
    let participantId = petition?.participants[0]?.id;

    try {
      if (participantId) {
        await http.put(
          `participants/${participantId}`,
          petition.participants[0]
        );
      } else {
        const { data } = await http.post("participants", {
          ...petition.participants[0],
          profilePhoto: retryUploadImage === null ? petition.participants[0]?.profilePhoto : undefined,
          petitionId: petition.id,
        });
        participantId = data[0]?.id;
      }
      toast.success("Petição atualizada com sucesso", {
        duration: 3000,
        onClose: () => router("/peticao"),
      });

      if (retryUploadImage !== null) {
        await retryUpload(participantId);
      }
    } catch (error: any) {
      const messages = error.response?.data?.message
      if (messages?.length) {
        const content = () => (<div>
          <h2 className="text-lg font-bold">Erro ao atualizar petição</h2>
          <div className="w-full border-t border-gray-300" />
          {messages.map((message: string, index: number) => (
            <div key={message}>
              <span>{message}</span>
              {index < messages.length - 1 && (', \n')}
            </div>
          ))}
        </div>)
        return toast.error(content, { closeOnClick: true });
      }
      return toast.error("Erro ao atualizar petição, por favor verifique os campos preenchidos", { closeOnClick: true });
    }
  };

  const submit = async () => {
    return mode === "coordinator"
      ? changeToWaitingInformation()
      : updatePetition();
  };

  const close = () => {
    router("/peticao");
  };

  const statusIsCreated = petition?.status === "CREATED";
  const isCoordinator = mode === "coordinator";

  const ToRender = () => {
    if (isCoordinator && statusIsCreated) {
      return <Files />
    }
    const contents = [petition?.publicUrl];
    if (isCoordinator) {
      contents.push(petition?.privateUrl);
    }

    return (
      <>
        <HandlerTabs />
        <File contents={contents} />
      </>
    )
  }
  return (
    <BoxScreen showBreadcrumbs background={!statusIsCreated || statusIsCreated && !isCoordinator}>
      <div className="grid grid-cols-2 gap-8">
        <ToRender />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <span className={`${mode === "analyst" || !statusIsCreated ? "invisible" : ""}`}>
          <Checkbox
            crossOrigin
            label="Todas as informações sigilosas foram devidamente preenchidas*"
            labelProps={{ className: "uppercase text-[#8C0000] font-bold text-lg tracking-wide" }}
            containerProps={{ className: "rounded-lg p-0 mr-2 border border-primary-600" }}
            checked={checkedConfirmation}
            onChange={() => setCheckedConfirmation(!checkedConfirmation)}
          />
        </span>
        <div className="flex items-center justify-end gap-8">
          <Button
            placeholder={"Cancelar alterações"}
            className={`rounded-3xl bg-red-600 px-11 py-4 w-48 ${(statusIsCreated && mode === "analyst") ? "invisible" : ""}`}
            onClick={close}
          >
            Cancelar
          </Button>
          <Button
            placeholder={"Salvar alterações"}
            className="rounded-3xl bg-primary-600 px-11 py-4 w-48"
            disabled={(statusIsCreated && mode === 'coordinator') && disableSaveButton}
            onClick={(statusIsCreated && mode === "analyst") ? close : submit}
          >
            {(statusIsCreated && mode === "analyst") ? "Fechar" : "Salvar"}
          </Button>
        </div>
      </div>
    </BoxScreen>
  );
};

interface FileProps {
  contents: string[];
}
const File = ({ contents }: FileProps) => {
  return <ImageFiles contents={contents} />;
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
