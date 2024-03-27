import { Button } from "@material-tailwind/react";
import { Eye, Trash } from "lucide-react";
import { useState } from "react";
import { tv } from "tailwind-variants";

interface ParticipantProps {
  avatar: string;
  name: string;
  absent?: Absent;
}

interface Absent {
  reason: string;
  action: {
    history: string;
    edit: string;
  };
}

const participant = tv({
  base: "flex items-center relative border h-12 w-72 p-2 rounded-lg gap-4 shadow-md transition-all ease-in-out duration-300 hover:shadow-lg",
  variants: {
    absent: {
      yes: "border-primary-400 shadow-primary-100",
      no: "border-primary-600 shadow-primary-200",
    },
    showReason: {
      yes: "",
      no: "overflow-hidden",
    },
  },
  defaultVariants: {
    absent: "no",
    showReason: "no",
  },
});

export function Participant({ avatar, name, absent }: ParticipantProps) {
  const [showReason, setShowReason] = useState(false);
  return (
    <>
      <div
        className={participant({
          absent: absent ? "yes" : "no",
          showReason: showReason ? "yes" : "no",
        })}
      >
        <img
          src={avatar}
          alt="Foto de perfil"
          className="rounded-full h-9 w-9"
        />
        <p className="text-primary-700 text-lg font-medium text-nowrap truncate max-w-40">
          {name}
        </p>
        <TagAbsent absent={absent?.reason} />
        <EyeAbsent absent={absent} />
        <AbsentButton absent={!!absent} />
      </div>
      {absent && showReason && (
        <div
          className="absolute top-0 left-0 h-screen w-screen z-40"
          onClick={() => setShowReason(false)}
        ></div>
      )}
    </>
  );

  function EyeAbsent({ absent }: { absent?: Absent }) {
    if (!absent) return null;

    return (
      <>
        <div
          onClick={() => {
            console.log("click");
            setShowReason((old) => !old);
          }}
          className="flex justify-center items-center text-primary-600 fill-current h-7 w-7 hover:scale-105 cursor-pointer transition-all ease-in-out duration-300 z-50"
        >
          <Eye />
        </div>
        <div
          className={`
               absolute top-[105%] left-0 w-72 p-2 bg-white rounded-bl-lg rounded-br-lg shadow-2xl z-50
               flex items-center flex-col gap-2
               ${showReason ? "block" : "hidden"}
            `}
        >
          <p className="text-primary-600 text-md">{absent.reason}</p>
          <div className="flex flex-row justify-around items-center w-full">
            <Button
              variant="outlined"
              className="w-2/5 border-primary-300 flex justify-center items-center text-sm p-2"
              placeholder="Histórico do participante"
            >
              Histórico
            </Button>
            <Button
              variant="outlined"
              className="w-2/5 border-primary-300 flex justify-center items-center text-sm p-2"
              placeholder="Editar participante"
            >
              Editar
            </Button>
          </div>
        </div>
      </>
    );
  }

  function TagAbsent({ absent }: { absent?: string }) {
    if (!absent) return null;
    return (
      <>
        <div className="flex justify-center items-center border border-primary-400 text-gray-700 h-7 w-fit p-0.5 rounded-lg">
          Ausente
        </div>
      </>
    );
  }

  function AbsentButton({ absent }: { absent: boolean }) {
    const [showButton, setShowButton] = useState(false);
    if (absent) return null;
    return (
      <>
        <div
          className="absolute top-0 left-0 z-40 w-full h-full transition-all ease-in-out duration-300"
          onMouseEnter={() => setShowButton(true)}
          onMouseLeave={() => setShowButton(false)}
        >
          <Button
            placeholder="Botão de ausência"
            className={`
               flex justify-center items-center h-full w-40 absolute top-0 rounded-r-lg rounded-l-none z-50
               ${
                 !absent ? "w-3/5 bg-primary-600 border border-primary-600" : ""
               }
               ${showButton ? "right-0" : "-right-44"}
            `}
          >
            <Trash stroke="#FFF" />
            Ausente
          </Button>
        </div>
      </>
    );
  }
}
