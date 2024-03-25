import { useCallback, useEffect, useState } from "react";
import { Participant } from "../../components";
import { BoxGroup, BoxScreen } from "../../components/box";
import { FilterText } from "../../components/filter";
import { InputParticipant } from "../../components/participant/Input";
import { IParticipant } from "../../entity";
import { useHttp, useCookies } from "../../lib";
import { Button } from "@material-tailwind/react";
import { Trash } from "lucide-react";
import { tv } from "tailwind-variants";

interface Desigantion {
  id: string;
  group: Group;
  status: "OPEN" | "CLOSED";
  assignments: Assignment[];
  participants: IParticipant[];
}

interface Assignment {
  point: Point;
  publication_carts: PublicationCart[];
  participants: IParticipant[];
  config: {
    max: number;
    min: number;
  };
}

interface PublicationCart {
  id: string;
  name: string;
}

interface Point {
  id: string;
  name: string;
  status: boolean;
}

interface Group {
  id: string;
  name: string;
  config: {
    startHour: string;
    endHour: string;
    weekday: string;
    minParticipants: number;
    maxParticipants: number;
  };
}

export function Designar() {
  const http = useHttp();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [desigantion, setDesigantion] = useState<Omit<
    Desigantion,
    "assignments" | "participants"
  > | null>();

  const getParticipants = useCallback(async () => {
    try {
      const groupId = "65fe068c81870be5412f90fd";
      const { data } = await http.get<Desigantion>("/designations/week", {
        params: {
          groupId,
        },
      });
      setAssignments(
        sortAssignments(
          data.assignments.map((a) => ({
            ...a,
            participants: addFakeImage(a.participants),
          }))
        )
      );
      setParticipants(
        addFakeImage(
          data.participants.concat(data.participants).concat(data.participants)
        )
      );
      setDesigantion({
        id: data.id,
        group: data.group,
        status: data.status,
      });
    } catch (error) {
      console.error(error);
    }
  }, [http]);
  useEffect(() => {
    getParticipants();
  }, [getParticipants]);

  const sortAssignments = (assignments: Assignment[]) => {
    // assignments when this assignment.config.max > assignment.participants?.length is true is first

    return assignments.sort((a, b) => {
      if (a.config.max > a.participants?.length) return -1;
      if (b.config.max > b.participants?.length) return 1;
      return 0;
    });
  };

  return (
    <>
      <BoxScreen>
        <div className="w-full justify-between items-center flex gap-4">
          <div className="flex justify-between items-center w-2/3">
            <FilterText toSearch="Pesquisar Voluntários" />
            <ParticipantsToAssign participants={participants} />
          </div>
          <Button placeholder={"Designar Automaticamente"}>
            Designação Automática
          </Button>
        </div>
        <div
          className="flex flex-wrap gap-8 justify-between w-full duration-300 ease-in-out transition-transform transform"
          hidden={!assignments?.length && !participants?.length}
        >
          {assignments.map((assignment) => {
            const perPoint =
              assignment.config.min === assignment.config.max
                ? assignment.config.min.toString()
                : `${assignment.config.min} - ${assignment.config.max}`;

            return (
              <div
                // hidden={!assignment.participants?.length}
                id={assignment.point.id}
                key={assignment.point.id}
              >
                <BoxGroup
                  pointName={assignment.point.name}
                  pointCars={perPoint}
                >
                  {assignment.participants.map((participant) => (
                    <Participant.Root
                      name={participant.name}
                      key={participant.id}
                      avatar={participant.profile_photo}
                    >
                      {() => (
                        <Participant.Button>
                          {({ showButton }) => (
                            <Button
                              placeholder="Botão de ausência"
                              className={`
                              flex justify-center items-center h-full w-40 absolute top-0 rounded-r-lg rounded-l-none z-50 pointer-events-none bg-primary-600 border border-primary-600
                              ${showButton ? "right-0" : "-right-44"}
                           `}
                              type="button"
                            >
                              <Trash stroke="#FFF" />
                              Ausente
                            </Button>
                          )}
                        </Participant.Button>
                      )}
                    </Participant.Root>
                  ))}
                  {assignment.config.max > assignment.participants?.length &&
                    participants?.length && (
                      <InputParticipant
                        crossOrigin
                        participants={participants}
                        placeholder="Adicionar voluntário"
                        positionList={
                          assignment.participants?.length >= 1
                            ? "top"
                            : "bottom"
                        }
                        onSelect={(participantId) => {
                          console.log(participantId);
                        }}
                      />
                    )}
                </BoxGroup>
              </div>
            );
          })}
        </div>
      </BoxScreen>
    </>
  );
}

const addFakeImage = (participants: IParticipant[]): IParticipant[] => {
  return participants.map((participant) => ({
    ...participant,
    profile_photo: `https://source.unsplash.com/random/40x40?sig=${participant.id}`,
  }));
};

const participantstoAssign = tv({
  base: "w-8 h-8 rounded-full object-cover sticky",
  variants: {
    noFirst: {
      yes: "-ml-2",
    },
  },
});
function ParticipantsToAssign({
  participants,
}: {
  participants: IParticipant[];
}) {
  // return a list with the images of the participants, the images is a circle with the first letter of the name of the participant or your image
  return (
    <div className="flex justify-start items-center relative">
      {participants.map((participant, index) => {
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
            src={
              participant.profile_photo ||
              `https://ui-avatars.com/api/?name=${participant.name}`
            }
            alt={participant.name}
            title={participant.name}
            className={participantstoAssign({
              noFirst: index !== 0 ? "yes" : undefined,
              className: `${"z-"[zIndex - 10]}`,
            })}
          />
        );
      })}
    </div>
  );
}
