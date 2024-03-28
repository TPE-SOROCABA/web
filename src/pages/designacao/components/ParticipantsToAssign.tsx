import { tv } from "tailwind-variants";
import { IParticipant } from "../../../entity";
import { addFakeImage } from "../../../lib/addFakeImage";

const participantstoAssign = tv({
  base: "w-8 h-8 rounded-full object-cover sticky",
  variants: {
    noFirst: {
      yes: "-ml-2",
    },
  },
});

export function ParticipantsToAssign({
  participants,
}: {
  participants: IParticipant[];
}) {
  const [present, absent] = participants.reduce(
    (acc, participant) => {
      if (participant.incident_history) {
        acc[1].push(participant);
      } else {
        acc[0].push(participant);
      }
      return acc;
    },
    [[], []] as [IParticipant[], IParticipant[]]
  );

  function RenderParticipant({
    participants,
    label,
  }: {
    participants: IParticipant[];
    label: string;
  }) {
    if (!participants.length) return null;
    return (
      <div className="flex justify-start items-center relative">
        <span className="text-xs text-gray-800 min-w-16">{label}:</span>
        {addFakeImage(participants).map((participant, index) => {
          const zIndex = 10;
          if (index > 5) return null;
          if (index === 5)
            return (
              <span
                key="more"
                className={`
                  -ml-2 min-w-8 h-8 rounded-full object-cover flex justify-center items-center bg-primary-600 text-white sticky
                  ${"z-"[zIndex - 10]}
                `}
                title={participants
                  .slice(5)
                  .map((p) => p.name)
                  .join(",\n")}
              >
                +{participants.length - 5}
              </span>
            );
          return (
            <img
              key={participant.id}
              src={participant.profile_photo}
              alt={participant.name}
              title={participant.name}
              className={participantstoAssign({
                noFirst: index !== 0 ? "yes" : undefined,
                className: `${"z-"[zIndex - 10]} ${
                  participant.incident_history
                    ? " cursor-not-allowed opacity-40"
                    : ""
                }`,
              })}
            />
          );
        })}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1 items-start h-full">
      <RenderParticipant
        participants={present}
        label={"Presente" + (present.length > 1 ? "s" : "")}
      />
      <RenderParticipant
        participants={absent}
        label={"Ausente" + (absent.length > 1 ? "s" : "")}
      />
    </div>
  );
}
