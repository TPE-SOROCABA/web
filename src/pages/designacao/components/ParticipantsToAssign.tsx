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
    return (
        <div className="flex justify-start items-center relative">
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
                            className: `${"z-"[zIndex - 10]} ${participant.incident_history ? " cursor-not-allowed opacity-40" : ""}`,
                        })}
                    />
                );
            })}
        </div>
    );
}