import { Button, Textarea } from "@material-tailwind/react";
import { Trash } from "lucide-react";
import { IParticipant } from "../../../entity";
import { Assignment } from "../interfaces";
import { useState } from "react";
import { Alert } from "../../../components";
import toast from "react-hot-toast";

type AlertAbsentParticipantProps = {
  showButton: boolean;
  setParticipants: React.Dispatch<React.SetStateAction<IParticipant[]>>;
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  participant: IParticipant;
  assignment: Assignment;
  createIncidentParticipants: (
    participantId: string,
    reason: string
  ) => Promise<void>;
  handleUpdatePointParticipants: (
    pointId: string,
    participantsId: string[]
  ) => Promise<void>;
  onBlur: () => void;
};

export function AlertAbsentParticipant({
  showButton,
  setParticipants,
  setAssignments,
  participant,
  assignment,
  createIncidentParticipants,
  handleUpdatePointParticipants,
  onBlur,
}: AlertAbsentParticipantProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [reason, setReason] = useState("");

  const close = () => {
    setShowAlert(false);
    onBlur();
  };
  return (
    <>
      <Button
        placeholder="Botão de ausência"
        className={`
          items-center gap-2
          h-full w-1/2 z-20
          rounded-r-lg rounded-l-none bg-primary-600 border border-primary-600
          ${showButton ? "flex" : "hidden"}
        `}
        onClick={() => setShowAlert(true)}
        type="button"
      >
        <Trash stroke="#FFF" />
        Ausente
      </Button>
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
          <div className="flex justify-between items-center mt-4 w-full">
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
                setParticipants((prev) => [...prev, participant]);
                setAssignments((prev) =>
                  prev.map((a) =>
                    a.point.id === assignment.point.id
                      ? {
                          ...a,
                          participants: a.participants.filter(
                            (p) => p.id !== participant.id
                          ),
                        }
                      : a
                  )
                );
                await createIncidentParticipants(participant.id, reason);
                await handleUpdatePointParticipants(
                  assignment.point.id,
                  assignment.participants
                    .filter((p) => p.id !== participant.id)
                    .map((p) => p.id)
                );
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
