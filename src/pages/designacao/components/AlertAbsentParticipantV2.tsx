import { Button, Textarea } from "@material-tailwind/react";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Alert } from "../../../components";

type AlertAbsentParticipantProps = {
  showButton: boolean;
  submitReason: (reason: string) => void;
  closeComponent: () => void;
};

export function AlertAbsentParticipantV2({
  showButton,
  submitReason,
  closeComponent
}: AlertAbsentParticipantProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [reason, setReason] = useState("");

  const close = () => {
    setShowAlert(false);
    setReason("");
    closeComponent()
  };

  return (
    <>
      <div
        className={`
          absolute ${
            showButton ? "right-0" : "-right-44"
          } top-0 w-1/2 h-full transition-all ease-in-out duration-300 z-0
        `}
      >
        <Button
          placeholder="Botão de ausência"
          className={`
          flex items-center gap-2
          h-full w-full rounded-r-lg rounded-l-none bg-primary-600 border border-primary-600
        `}
          onClick={() => setShowAlert(true)}
          type="button"
        >
          <Trash stroke="#FFF" />
          Ausente
        </Button>
      </div>
      <Alert show={showAlert} close={close}>
        <div className="flex justify-between items-center flex-col gap-2 bg-white p-4 rounded-lg min-w-[20vw] max-w-96">
          <h6 className="text-lg font-bold text-left w-full">Nota</h6>
          <Textarea
            autoFocus
            label="Motivo da ausência"
            className="bg-primary-100"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></Textarea>
          <div className="flex justify-between items-center mt-4 w-full gap-2">
            <Button
              placeholder="Cancelar"
              onClick={close}
              className="w-32 rounded-3xl"
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              placeholder="Botão de ausência"
              onClick={() => {
                submitReason(reason)
                close()
              }}
              className="w-32 bg-primary-500 rounded-3xl"
            >
              Salvar
            </Button>
          </div>
        </div>
      </Alert>
    </>
  );
}
