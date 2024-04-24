import { Button, Textarea } from "@material-tailwind/react";
import { useState } from "react";
import { Alert } from "../../components";
import toast from "react-hot-toast";

type AlertAbsentParticipantProps = {
  showButton: boolean;
  close: () => void;
  submit: (reason: string) => void;
};

export function AlertAbsentParticipant({
  showButton,
  close,
  submit,
}: AlertAbsentParticipantProps) {
  const [reason, setReason] = useState("");

  return (
    <>
      <Alert show={showButton} close={close}>
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
              onClick={async () => {
                if (!reason) return toast.error("Informe o motivo da ausência");
                submit(reason);
                setReason("");
                close();
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
