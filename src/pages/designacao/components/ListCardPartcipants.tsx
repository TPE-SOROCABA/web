import { BookmarkMinus, BookmarkPlus } from "lucide-react";
import { Alert } from "../../../components";
import { IParticipant } from "../../../entity";
import { formatPhone } from "../../../utils";
import { Designation } from "../interfaces";
import { Button, Textarea } from "@material-tailwind/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ListaParticipantesProps {
    designationStatus: Designation["status"] | null;
    participants: IParticipant[];
    handleAbsentEvent: (participant: IParticipant, reason: string) => void;
    handleActiveEvent: (participant: IParticipant) => void;
}

export function ListaCardsParticipantes({
    participants,
    handleAbsentEvent,
    handleActiveEvent,
}: ListaParticipantesProps) {


    if (!participants.length)
        return (
            <div className="flex justify-center items-center h-96 w-full rounded-lg">
                <h1 className="text-xl text-gray-400">
                    Nenhum participante encontrado
                </h1>
            </div>
        );

    return (
        <div
            className="flex flex-wrap gap-8 justify-around w-full"
        >
            {participants.filter((p) => p.name).map((participant) =>
                <ParticipantCard
                    participant={participant}
                    handleAbsentEvent={handleAbsentEvent}
                    handleActiveEvent={handleActiveEvent}
                />)}
        </div>
    );
}

function ParticipantCard({ participant, handleAbsentEvent, handleActiveEvent }: { participant: IParticipant, handleAbsentEvent: (participant: IParticipant, reason: string) => void, handleActiveEvent: (participant: IParticipant) => void }) {
    const [showButton, setShowButton] = useState(false);
    const [reason, setReason] = useState("");
    return (
        <div className="w-56 h-40 border rounded-lg shadow-md bg-gray-50 relative flex flex-col justify-between" key={participant.id} >
            <span className="absolute right-0 -top-1">
                {participant.incident_history ?
                    <BookmarkMinus className="fill-red-500 stroke-none" />
                    :
                    <BookmarkPlus className="fill-green-500 stroke-none" />
                }
            </span>
            <div className="flex gap-3 p-2 items-center">
                <img src={participant.profile_photo} alt={participant.name} className="w-10 h-10 rounded-full mt-2" />
                <div>
                    <div className="w-4/5 truncate">{participant.name}</div>
                    <div className="text-sm text-gray-600">{formatPhone(participant.phone)}</div>

                </div>
            </div>
            <div className="px-4 text-sm text-gray-800">
                <span>{participant.incident_history && participant.incident_history.reason}</span>
            </div>
            <div className="w-full flex justify-center gap-4 p-4">
                <Button
                    variant="outlined"
                    className="rounded-md w-20 p-2"
                    placeholder="Designar"
                    type="button"
                    disabled={true}
                >
                    Histórico
                </Button>
                {participant.incident_history ? (
                    <Button
                        variant="filled"
                        className="bg-green-600 rounded-md w-20 p-2"
                        placeholder="Designar"
                        type="button"
                        onClick={() => handleActiveEvent(participant)}
                    >
                        Ativar
                    </Button>
                ) : (
                    <Button
                        variant="filled"
                        className="bg-primary-600 rounded-md w-20 p-2"
                        placeholder="Designar"
                        type="button"
                        onClick={() => setShowButton(true)}
                    >
                        Ausente
                    </Button>
                )}
                <Alert show={showButton} close={() => setShowButton(false)}>
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
                                onClick={() => setShowButton(false)}
                                className="w-32 rounded-3xl"
                                variant="outlined"
                            >
                                Cancelar
                            </Button>
                            <Button
                                placeholder="Botão de ausência"
                                onClick={() => {
                                    if (!reason) return toast.error("Informe o motivo da ausência");
                                    if (reason.length < 3) return toast.error("Motivo muito curto");
                                    handleAbsentEvent(participant, reason);
                                    setShowButton(false)
                                }}
                                className="w-32 bg-primary-500 rounded-3xl"
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                </Alert>
            </div>
        </div>
    );
}