import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { Participant } from ".";
import { IParticipant } from "../../entity";

type InputProps = React.ComponentProps<typeof Input>;

interface InputParticipantProps extends InputProps {
  avatar?: string;
  participants: IParticipant[];
}

const defaultAvatar = "https://source.unsplash.com/random/WIDTHxHEIGHT";
export function InputParticipant({
  avatar = defaultAvatar,
  crossOrigin,
  className,
  participants,
  ...rest
}: InputParticipantProps) {
  const [showParticipants, setShowParticipants] = useState(false);
  const [search, setSearch] = useState("");
  const [participantSelected, setParticipantSelected] =
    useState<IParticipant | null>(null);

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
            w-full border-0 !border-transparent pt-2
            ${className}
          `}
          variant="static"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          onFocus={() => setShowParticipants(true)}
          onBlur={() => setShowParticipants(false)}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <div
          className={`
            ${
              showParticipants ? "flex" : "hidden"
            } gap-4 p-4 flex-wrap absolute top-full left-0 w-full bg-white border border-primary-300 rounded-xl shadow-lg drop-shadow-lg border-t-0 rounded-t-none max-h-60 items-start overflow-auto
        `}
        >
          {participantsToRender?.length ? (
            participantsToRender.map((participant) => (
              <Participant.Root
                key={participant._id}
                name={participant.name}
                avatar={avatar}
              >
                <Participant.Button>
                  {(showButton) => (
                    <Button placeholder="Selecionar participante">
                      selecionar
                    </Button>
                  )}
                </Participant.Button>
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
