import { useCallback, useEffect, useState } from "react";
import { Participant } from "../../components";
import { BoxGroup, BoxScreen } from "../../components/box";
import { FilterText } from "../../components/filter";
import { InputParticipant } from "../../components/participant/Input";
import { IParticipant } from "../../entity";
import { useHttp, useToastHot } from "../../lib";
import { Button } from "@material-tailwind/react";
import { ArrowRightLeft, Trash } from "lucide-react";
import { tv } from "tailwind-variants";
import { addFakeImage } from "../../lib/addFakeImage";

interface Desigantion {
  id: string;
  group: Group;
  status: "OPEN" | "CLOSED";
  assignments: Assignment[];
  participants: IParticipant[];
  createdAt: string;
  updatedAt: string;
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

let timeout: NodeJS.Timeout;

export function Designar() {
  const http = useHttp();
  const toast = useToastHot();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [desigantion, setDesignation] = useState<Omit<
    Desigantion,
    "assignments" | "participants"
  > | null>();

  const getParticipants = useCallback(async (props?: { random?: boolean; filter?: string }) => {
    try {
      const groupId = "65fe068c81870be5412f90fd";
      const params = {
        groupId,
        filter: props?.filter ?? undefined,
        random: props?.random ?? undefined
      }
      const { data } = await http.get<Desigantion>("/designations/week", {
        params,
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
      setDesignation({
        id: data.id,
        group: data.group,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    } catch (error) {
      console.error(error);
    }
  }, [http]);

  useEffect(() => {
    getParticipants();
  }, [getParticipants]);

  const handleRandom = async () => {
    await toast.promise(getParticipants({ random: true }), {
      loading: "Designando automaticamente...",
      success: "Designação automática realizada com sucesso",
      error: "Erro ao designar automaticamente",
    });
  }

  const handleSearch = async (search: string) => {
    timeout && clearTimeout(timeout);
    if (!search) return getParticipants();
    timeout = setTimeout(async () => {
      await toast.promise(getParticipants({ filter: search }), {
        loading: "Buscando participantes e pontos...",
        success: "Busca realizada com sucesso",
        error: "Erro ao buscar participantes e pontos",
      });
    }, 800);
  }

  const handleUpdate = async (assignments: Assignment[], participants: IParticipant[]) => {
    timeout && clearTimeout(timeout);
    const body = {
      ...desigantion,
      assignments: assignments,
      participants: participants,
    };
    timeout = setTimeout(async () => {
      // eslint-disable-next-line no-async-promise-executor
      await toast.promise(new Promise(async (resolve, reject) => {
        try {

          await http.put<Desigantion>("/designations/" + desigantion?.id, body);
          await getParticipants();
          resolve(true)
        } catch (error) {
          console.error(error);
          reject(false);
        }
      }
      ), {
        loading: "Atualizando designação...",
        success: "Designação atualizada com sucesso",
        error: "Erro ao atualizar designação",
      });
    }, 300);
  }

  return (
    <>
      <BoxScreen loader={!assignments.length}>
        <div className="w-full justify-between items-center flex gap-4">
          <div className="flex justify-between items-center w-2/3 gap-4">
            <FilterText toSearch="Pesquisar Voluntários" handleSearchEvent={handleSearch} />
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
                id={assignment.point.id}
                key={assignment.point.id}
              >
                <BoxGroup
                  pointName={assignment.point.name}
                  pointCars={perPoint}
                  pointStatus={assignment.point.status}
                  boxGroupEvent={(value) => {
                    setAssignments((prev) => {
                      const data = prev.map((a) => {
                        if (a.point.id === assignment.point.id) {
                          // verifica se é para desativar o ponto
                          if (!value) {
                            setParticipants((prev) => [
                              ...prev,
                              ...a.participants,
                            ]);
                            return {
                              ...a,
                              point: {
                                ...a.point,
                                status: false,
                              },
                              participants: [],
                            };
                          } else {
                            // verifica se é para ativar o ponto
                            return {
                              ...a,
                              point: {
                                ...a.point,
                                status: true,
                              },
                            }
                          }
                        }
                        // se não for o ponto que está sendo alterado, retorna o ponto sem alterações
                        return a;
                      }
                      )
                      handleUpdate(data, participants)
                      return data
                    }
                    );

                  }}
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
                            <>
                              <Button
                                onClick={() => {
                                  setParticipants((prev) => [...prev, participant]);
                                  setAssignments((prev) =>
                                    prev.map((a) =>
                                      a.point.id === assignment.point.id
                                        ? {
                                          ...a,
                                          participants: a.participants.filter(
                                            (p) => p.id !== participant.id
                                          ),
                                        }
                                        : a
                                    )
                                  );
                                }}
                                placeholder="Botão de ausência"
                                className={`
                                    flex items-center gap-2
                                    h-full w-40 
                                    absolute top-0
                                    rounded-l-lg rounded-r-none bg-gray-600 border border-gray-600 cursor-pointer
                                    ${showButton ? "left-0" : "-left-44"}
                                `}
                                type="button"
                              >
                                <ArrowRightLeft stroke="#FFF" />
                                Trocar
                              </Button>
                              <Button
                                placeholder="Botão de ausência"
                                className={`
                                    flex items-center gap-2
                                    h-full w-40 z-20
                                    absolute top-0 
                                    rounded-r-lg rounded-l-none bg-primary-600 border border-primary-600
                                    ${showButton ? "right-0" : "-right-44"}
                                `}
                                type="button"
                              >
                                <Trash stroke="#FFF" />
                                Ausente
                              </Button>


                            </>
                          )}
                        </Participant.Button>
                      )}
                    </Participant.Root>
                  ))}
                  {assignment.config.max > assignment.participants?.length &&
                    participants?.length && (
                      <InputParticipant
                        crossOrigin
                        disabled={!assignment.point.status}
                        participants={participants}
                        placeholder="Adicionar voluntário"
                        onSelect={(participantId) => {
                          setAssignments((prev) =>
                            prev.map((a) =>
                              a.point.id === assignment.point.id
                                ? {
                                  ...a,
                                  participants: [
                                    ...a.participants,
                                    participants.find(
                                      (p) => p.id === participantId
                                    )!,
                                  ],
                                }
                                : a
                            )
                          );
                          setParticipants((prev) =>
                            prev.filter((p) => p.id !== participantId)
                          );
                        }}
                      />
                    )}
                </BoxGroup>
              </div>
            );
          })}

          <div className="w-full flex justify-end">
            <Button
              className="bg-primary-600 text-white"
              placeholder={"Disparar designação"}
              onClick={async () => {
                await toast.promise(http.post<Desigantion>("/designations/send/" + desigantion?.id), {
                  loading: "Disparando designação...",
                  success: "Designação disparada com sucesso",
                  error: "Erro ao disparar designação",
                });
              }}>
              Disparar designação
            </Button>
          </div>
        </div>
      </BoxScreen>
    </>
  );
}



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
              className: `${"z-"[zIndex - 10]}`,
            })}
          />
        );
      })}
    </div>
  );
}
