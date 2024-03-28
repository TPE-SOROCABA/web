import { Participant } from "../../components";
import { BoxGroup, BoxScreen } from "../../components/box";
import { FilterText } from "../../components/filter";
import { InputParticipant } from "../../components/participant/Input";
import { useHttp, useToastHot } from "../../lib";
import { Button } from "@material-tailwind/react";
import { ArrowRightLeft } from "lucide-react";
import { Designation } from "./interfaces";
import { ParticipantsToAssign } from "./components/ParticipantsToAssign";
import { useDesignation } from "./useDesignation";
import { AlertAbsentParticipant } from "./components/AlertAbsentParticipant";

export function Designar() {
  const http = useHttp();
  const toast = useToastHot();
  const hook = useDesignation();
  const { assignments, participants, desigantion, handleRandom, handleSearch } =
    hook;

  return (
    <>
      <BoxScreen loader={!assignments.length}>
        {/*  Filtros e botão de designação automática */}
        <div className="w-full justify-between items-center flex gap-4">
          <div className="flex justify-between items-center w-2/3 gap-4">
            <FilterText
              toSearch="Pesquisar Voluntários"
              handleSearchEvent={handleSearch}
            />
            <ParticipantsToAssign participants={participants} />
          </div>
          <Button
            className="bg-primary-600 text-white"
            placeholder={"Designar Automaticamente"}
            onClick={handleRandom}
          >
            Designação Automática
          </Button>
        </div>
        {/*  Filtros e botão de designação automática */}
        <div
          className="flex flex-wrap gap-8 justify-between w-full duration-300 ease-in-out transition-transform transform"
          hidden={!assignments?.length && !participants?.length}
        >
          {/*  Designação de pontos */}
          <DesignationAssignments hook={hook} />
          {/*  Designação de pontos */}
          {/* Botão de disparar designação */}
          <div className="w-full flex justify-end">
            <Button
              className="bg-primary-600 text-white"
              placeholder={"Disparar designação"}
              onClick={async () => {
                await toast.promise(
                  http.post<Designation>(
                    "/designations/send/" + desigantion?.id
                  ),
                  {
                    loading: "Disparando designação...",
                    success: "Designação disparada com sucesso",
                    error: (error) =>
                      error?.response?.data?.message ||
                      "Erro ao disparar designação",
                  }
                );
              }}
            >
              Disparar designação
            </Button>
          </div>
          {/* Botão de disparar designação */}
        </div>
      </BoxScreen>
    </>
  );
}

export function DesignationAssignments({
  hook,
}: {
  hook: ReturnType<typeof useDesignation>;
}) {
  const toast = useToastHot();
  const {
    assignments,
    participants,
    getParticipants,
    handleUpdatePoint,
    handleUpdatePointParticipants,
    createIncidentParticipants,
    setAssignments,
    setParticipants,
  } = hook;

  return assignments.map((assignment) => {
    const perPoint =
      assignment.config.min === assignment.config.max
        ? assignment.config.min.toString()
        : `${assignment.config.min} - ${assignment.config.max}`;

    return (
      <div id={assignment.point.id} key={assignment.point.id}>
        <BoxGroup
          pointName={assignment.point.name}
          pointCars={perPoint}
          pointStatus={assignment.point.status}
          boxGroupEvent={(value) => {
            handleUpdatePoint(assignment.point.id, value);
            setAssignments((prev) => {
              const data = prev.map((a) => {
                if (a.point.id === assignment.point.id) {
                  // verifica se é para desativar o ponto
                  if (!value) {
                    setParticipants((prev) => [...prev, ...a.participants]);
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
                    };
                  }
                }
                // se não for o ponto que está sendo alterado, retorna o ponto sem alterações
                return a;
              });
              return data;
            });
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
                          handleUpdatePointParticipants(
                            assignment.point.id,
                            assignment.participants
                              .filter((p) => p.id !== participant.id)
                              .map((p) => p.id)
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
                      <AlertAbsentParticipant
                        showButton={showButton}
                        setParticipants={setParticipants}
                        setAssignments={setAssignments}
                        participant={participant}
                        assignment={assignment}
                        createIncidentParticipants={createIncidentParticipants}
                        handleUpdatePointParticipants={
                          handleUpdatePointParticipants
                        }
                      />
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
                onSelect={async (participantId) => {
                  setAssignments((prev) =>
                    prev.map((a) =>
                      a.point.id === assignment.point.id
                        ? {
                            ...a,
                            participants: [
                              ...a.participants,
                              participants.find((p) => p.id === participantId)!,
                            ],
                          }
                        : a
                    )
                  );
                  setParticipants((prev) =>
                    prev.filter((p) => p.id !== participantId)
                  );
                  handleUpdatePointParticipants(assignment.point.id, [
                    ...assignment.participants.map((p) => p.id),
                    participantId as string,
                  ]);
                }}
                cb={async () => {
                  await toast.promise(getParticipants(), {
                    loading: "Atualizando participantes e pontos...",
                    success: "Participante adicionado com sucesso",
                    error: "Erro ao adicionar participante",
                  });
                }}
              />
            )}
        </BoxGroup>
      </div>
    );
  });
}
