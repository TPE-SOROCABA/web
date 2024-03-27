import { Button, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Participant } from ".";
import { IParticipant } from "../../entity";
import defaultAvatar from "../../assets/avatar.png";
import toast from "react-hot-toast";
import { http } from "../../infra";

type InputProps = React.ComponentProps<typeof Input>;

interface InputParticipantProps {
  avatar?: string;
  participants: IParticipant[];
  onSelect: (participantId: IParticipant["id"]) => void;
  cb?: () => void;
}

export function InputParticipant({
  avatar,
  crossOrigin,
  className,
  participants,
  onSelect,
  cb,
  ...rest
}: InputParticipantProps & InputProps) {
  const [showParticipants, setShowParticipants] = useState(false);
  const [ignoreBlur, setIgnoreBlur] = useState(false);
  const [search, setSearch] = useState("");
  const [participantSelected, setParticipantSelected] =
    useState<IParticipant | null>(null);

  useEffect(() => {
    if (participantSelected) {
      setSearch(participantSelected.name);
    }
  }, [participantSelected]);

  const participantsToRender = participants.filter((participant) =>
    participant.name.toLowerCase().includes(search.toLowerCase())
  ).sort((_,b) => b.incident_history ? -1 : 1)

  const close = () => {
    setShowParticipants(false)
    setParticipantSelected(null);
    setSearch("");
  }

  return (
    <>
      <div
        className="flex justify-between items-center w-full gap-2 border border-primary-300 rounded-lg relative">
        {showParticipants && (
          <>
            <div
              onMouseEnter={close}
              onClick={close}
              className="absolute w-[100px] h-screen -left-24">
            </div>
            <div
              onMouseEnter={close}
              onClick={close}
              className="absolute w-[100px] h-screen -right-24">
            </div>
          </>
        )}
        <div className="flex justify-center items-center w-16">
          <img
            src={avatar || defaultAvatar}
            alt="Foto de perfil"
            className="rounded-full h-9 w-9"
          />
        </div>
        <Input
          {...rest}
          crossOrigin={crossOrigin}
          className={`
            w-full border-0 !border-transparent !pt-2
            ${className}
          `}
          variant="static"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          onFocus={() => setShowParticipants(true)}
          onClick={() => setShowParticipants(true)}
          onBlur={() => {
            if (ignoreBlur) return;
            close
          }}
          onChange={(e) => { setSearch(e.target.value); setShowParticipants(true) }}
          value={search}
        />
        <div
          className={`
            absolute top-11 left-0 z-20 
            bg-white border border-primary-300 rounded-xl border-t-0 rounded-t-none overflow-auto
            w-full gap-4 p-4 max-h-60
            flex flex-wrap items-start   
            ${showParticipants ? "block" : "hidden"}
          `}
          onMouseEnter={() => setIgnoreBlur(true)}
        >
          {participantsToRender?.length ? (
            participantsToRender.map((participant) => (
              <Participant.Root
                key={participant.id}
                name={participant.name}
                avatar={participant.profile_photo || avatar}
                incident_history={Boolean(participant?.incident_history) || false}
              >
                {() => (
                  <>

                    {!participant.incident_history ? (
                      <Participant.Button>
                        {({ showButton }) => (
                          <Button
                            placeholder="Selecionar participante"
                            className={`
                        flex justify-center items-center h-full w-40 absolute top-0 rounded-r-lg rounded-l-none z-10 bg-primary-600 border border-primary-600 cursor-pointer
                        ${showButton ? "right-0" : "-right-44"}
                          `}
                            onClick={() => {
                              onSelect(participant.id);
                              setParticipantSelected(participant);
                              close()
                            }}
                          >
                            selecionar
                          </Button>
                        )}
                      </Participant.Button>
                    ) : (<Participant.Button>
                      {({ showButton }) => (
                        <Button
                          placeholder="Selecionar participante"
                          className={`
                      flex justify-center items-center h-full w-40 absolute top-0 rounded-r-lg opacity-100 rounded-l-none z-50 bg-green-400 border border-green-400 cursor-pointer
                      ${showButton ? "right-0" : "-right-44"}
                        `}
                          onClick={async () => {
                            close()
                            await toast.promise(http.put(`/participants/${participant.id}/incidences/${participant.incident_history['id']}`,{ status: "IGNORED"}), {
                              loading: "Ativando participante",
                              success: "Participante ativado",
                              error: "Erro ao ativar participante"
                            });
                            cb && cb()
                          }}
                        >
                          ativar
                        </Button>
                      )}
                    </Participant.Button>)}
                  </>
                )}
              </Participant.Root>
            ))
          ) : (
            <p className="text-primary-700 text-lg font-medium">
              Sem resultados
            </p>
          )}
        </div>
      </div>
    </>
  );
}
