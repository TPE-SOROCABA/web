import { Button } from "@material-tailwind/react";
import { Eye, Trash } from "lucide-react";
import { Children, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { tv } from "tailwind-variants";

type ChildrenProps = {
  showMore: boolean;
  setShowMore: Dispatch<SetStateAction<boolean>>;
};

interface ParticipantProps {
  avatar?: string;
  name: string;
  absent?: Absent;
  // children: (p: ChildrenProps) => JSX.Element;
  children: ReactNode;
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

const defaultAvatar =
  "https://media.istockphoto.com/id/587805156/vector/profile-picture-vector-illustration.jpg?s=612x612&w=0&k=20&c=gkvLDCgsHH-8HeQe7JsjhlOY6vRBJk_sKW9lyaLgmLo=";

function ParticipantComponent({
  avatar = defaultAvatar,
  name,
  absent,
  children: Children,
}: ParticipantProps) {
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
        {/* {Children && (
          <Children showMore={showReason} setShowMore={setShowReason} />
        )} */}
      </div>
      {absent && showReason && (
        <div
          className="absolute top-0 left-0 h-screen w-screen z-40"
          onClick={() => setShowReason(false)}
        ></div>
      )}
    </>
  );
}

interface EyeComponentProps {
  show?: boolean;
  showMore: boolean;
  setShowMore: Dispatch<SetStateAction<boolean>>;
  moreText: string;
}
function EyeComponent({
  show,
  showMore,
  setShowMore,
  moreText,
}: EyeComponentProps) {
  if (!show) return null;

  return (
    <>
      <div
        onClick={() => {
          console.log("click");
          setShowMore((old) => !old);
        }}
        className="flex justify-center items-center text-primary-600 fill-current h-7 w-7 hover:scale-105 cursor-pointer transition-all ease-in-out duration-300 hover:drop-shadow-lg z-50"
      >
        <Eye />
      </div>
      <div
        className={`
             absolute top-[105%] left-0 w-72 p-2 bg-white rounded-bl-lg rounded-br-lg shadow-2xl drop-shadow-2xl z-50
             flex items-center flex-col gap-2
             ${showMore ? "block" : "hidden"}
          `}
      >
        <p className="text-primary-600 text-md">{moreText}</p>
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

interface TagComponentProps {
  show?: boolean;
  tagTitle: string;
}

function TagComponent({ show = true, tagTitle }: TagComponentProps) {
  if (!show) return null;
  return (
    <>
      <div className="flex justify-center items-center border border-primary-400 text-gray-700 h-7 w-fit p-0.5 rounded-lg">
        {tagTitle}
      </div>
    </>
  );
}

interface ButtonComponentProps {
  show?: boolean;
  children: ({ showButton }: { showButton: boolean }) => JSX.Element;
}
function ButtonComponent({
  show = true,
  children: Children,
}: ButtonComponentProps) {
  const [showButton, setShowButton] = useState(false);
  console.log("button component", showButton);
  if (!show) return null;
  return (
    <>
      <div
        className="absolute top-0 left-0 z-40 w-full h-full transition-all ease-in-out duration-300"
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => setShowButton(false)}
      >
        <Children showButton={showButton} />
      </div>
    </>
  );
}

export const Participant = {
  Root: ParticipantComponent,
  Eye: EyeComponent,
  Tag: TagComponent,
  Button: ButtonComponent,
};
