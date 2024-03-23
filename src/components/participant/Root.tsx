import { Dispatch, SetStateAction, useState } from "react";
import { tv } from "tailwind-variants";

type ChildrenProps = {
  showMore: boolean;
  setShowMore: Dispatch<SetStateAction<boolean>>;
};

interface ParticipantProps {
  avatar?: string;
  name: string;
  absent?: Absent;
  children: (p: ChildrenProps) => JSX.Element;
  // children: ReactNode;
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

const defaultAvatar = "https://source.unsplash.com/random/40x40";
export function ParticipantComponent({
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
        {Children && (
          <Children showMore={showReason} setShowMore={setShowReason} />
        )}
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
