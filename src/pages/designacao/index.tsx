import { useCallback, useEffect, useState } from "react";
import { Participant } from "../../components";
import { BoxGroup, BoxScreen } from "../../components/box";
import { FilterText } from "../../components/filter";
import { InputParticipant } from "../../components/participant/Input";
import { IParticipant } from "../../entity";
import { useHttp, useToastHot } from "../../lib";
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
  const toast = useToastHot();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [desigantion, setDesigantion] = useState<Omit<
    Desigantion,
    "assignments" | "participants"
  > | null>();

  const getParticipants = useCallback(async (random = false) => {
    try {
      const groupId = "65fe068c81870be5412f90fd";
      const { data } = await http.get<Desigantion>("/designations/week", {
        params: {
          groupId,
          random
        },
      });

      setAssignments(
        data.assignments.map((a) => ({
          ...a,
          participants: addFakeImage(a.participants),
        }))
      );
      setParticipants(
        addFakeImage(
          data.participants
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

  const handleRandom = async () => {
    await toast.promise(getParticipants(true), {
      loading: "Designando automaticamente...",
      success: "Designação automática realizada com sucesso",
      error: "Erro ao designar automaticamente",
    });
  }

  // const handleUpdate = async () => {
  //   const input: any = {
  //     ...desigantion,
  //     assignments: assignments,
  //     participants: participants,
  //   };
  //   console.log(input);
  // }


  return (
    <>
      <BoxScreen>
        <div className="w-full justify-between items-center flex gap-4">
          <div className="flex justify-between items-center w-2/3 gap-4">
            <FilterText toSearch="Pesquisar Voluntários" />
            <ParticipantsToAssign participants={participants} />
          </div>
          <Button
            className="bg-primary-600 text-white"
            placeholder={"Designar Automaticamente"}
            onClick={handleRandom}>
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

          <div className="w-full flex justify-center items-center">
            {/* <Button
              className="bg-primary-600 text-white"
              placeholder={"Atualizar"}
              onClick={handleUpdate}>Atualizar
            </Button> */}
          </div>
        </div>
      </BoxScreen>
    </>
  );
}

const addFakeImage = (participants: IParticipant[]): IParticipant[] => {
  return participants.map((participant) => {

    if (!participant.profile_photo) {
      participant.profile_photo = `https://ui-avatars.com/api/?name=${participant.name}&background=2d3477&color=fff`;
    }

    return participant;
  });
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
              `https://ui-avatars.com/api/?name=${participant.name}&background=2d3477&color=fff`
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
