import { Button, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Participant } from ".";
import { IParticipant } from "../../entity";

type InputProps = React.ComponentProps<typeof Input>;

interface InputParticipantProps extends InputProps {
  avatar?: string;
  participants: IParticipant[];
  positionList: "top" | "bottom";
  onSelect: (participantId: IParticipant["id"]) => void;
}

const defaultAvatar = "https://source.unsplash.com/random/WIDTHxHEIGHT";
export function InputParticipant({
  avatar = defaultAvatar,
  crossOrigin,
  className,
  participants,
  positionList,
  onSelect,
  ...rest
}: InputParticipantProps) {
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
  );
  return (
    <>
      <div className="flex justify-between items-center w-full gap-2 pr-2 border border-primary-300 rounded-lg relative">
        <div className="flex justify-center items-center w-16">
          <img
            src={avatar}
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
          onBlur={() => {
            if (ignoreBlur) return;
            setShowParticipants(false);
          }}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <div
          className={`
            z-40 gap-4 p-4 flex flex-wrap absolute left-0 w-full bg-white border border-primary-300 rounded-xl shadow-lg drop-shadow-lg border-t-0 rounded-t-none max-h-40 items-start overflow-auto
            ${showParticipants ? "block" : "hidden"}
            ${positionList === "top" ? "bottom-full" : "top-full"}
          `}
          onMouseEnter={() => setIgnoreBlur(true)}
        >
          {participantsToRender?.length ? (
            participantsToRender.map((participant) => (
              <Participant.Root
                key={participant.id}
                name={participant.name}
                avatar={avatar}
              >
                {() => (
                  <Participant.Button>
                    {({ showButton }) => (
                      <Button
                        placeholder="Selecionar participante"
                        className={`
                          flex justify-center items-center h-full w-40 absolute top-0 rounded-r-lg rounded-l-none z-50 bg-primary-600 border border-primary-600 cursor-pointer
                          ${showButton ? "right-0" : "-right-44"}
                        `}
                        onClick={() => {
                          console.log("here");
                          onSelect(participant.id);
                          setParticipantSelected(participant);
                        }}
                      >
                        selecionar
                      </Button>
                    )}
                  </Participant.Button>
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
