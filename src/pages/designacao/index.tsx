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
import { IParticipant } from "../../entity";

const isAbsent = (participant: IParticipant) =>
  participant.incident_history?.status === "OPEN";

export function Designar() {
  const http = useHttp();
  const toast = useToastHot();
  const {
    filteredAssignments,
    assignments,
    participants,
    desigantion,
    handleRandom,
    handleSearch,
    setFilteredAssignments,
    getParticipants,
    handleUpdatePoint,
    handleUpdatePointParticipants,
    createIncidentParticipants,
    setAssignments,
    setParticipants,
  } = useDesignation();

  return (
    <>
      <BoxScreen loader={!assignments.length}>
        {/*  Filtros e botão de designação automática */}
        <div className="w-full justify-between items-center flex gap-4">
          <div className="flex justify-between items-center w-2/5 gap-4">
            <FilterText
              toSearch="Pesquisar Voluntários"
              handleSearchEvent={handleSearch}
              showButton={false}
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
          {/*  Filtrados */}
          {!!filteredAssignments?.length && (
            <>
              <h2 className="text-2xl font-bold w-full">Filtrados</h2>
              <DesignationAssignments
                assignments={filteredAssignments}
                participants={participants}
                getParticipants={getParticipants}
                handleUpdatePoint={handleUpdatePoint}
                handleUpdatePointParticipants={handleUpdatePointParticipants}
                createIncidentParticipants={createIncidentParticipants}
                setAssignments={setFilteredAssignments}
                setParticipants={setParticipants}
              />
              <hr className="w-full my-4" />
            </>
          )}
          {/*  Filtrados */}
          {/*  Designação de pontos */}
          <DesignationAssignments
            assignments={assignments}
            participants={participants}
            getParticipants={getParticipants}
            handleUpdatePoint={handleUpdatePoint}
            handleUpdatePointParticipants={handleUpdatePointParticipants}
            createIncidentParticipants={createIncidentParticipants}
            setAssignments={setAssignments}
            setParticipants={setParticipants}
          />
          {/*  Designação de pontos */}
          {/* Botão de disparar designação */}
          <div className="w-full flex justify-end">
            <Button
              className="bg-primary-600 text-white"
              placeholder={"Disparar designação"}
              onClick={async () => {
                await toast.promise(
                  http.post<Designation>(
                    `/designations/${desigantion?.id}/send`,
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

type Hook = ReturnType<typeof useDesignation>;

export function DesignationAssignments({
  assignments,
  participants,
  getParticipants,
  handleUpdatePoint,
  handleUpdatePointParticipants,
  createIncidentParticipants,
  setAssignments,
  setParticipants,
}: {
  assignments: Hook["assignments"];
  participants: Hook["participants"];
  getParticipants: Hook["getParticipants"];
  handleUpdatePoint: Hook["handleUpdatePoint"];
  handleUpdatePointParticipants: Hook["handleUpdatePointParticipants"];
  createIncidentParticipants: Hook["createIncidentParticipants"];
  setAssignments: Hook["setAssignments"];
  setParticipants: Hook["setParticipants"];
}) {
  const toast = useToastHot();

  return assignments.map((assignment) => {
    const perPoint = assignment.publication_carts
      .map((cart) => cart.name)
      .join(", ");

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
              incident_history={isAbsent(participant)}
            >
              {() => (
                <Participant.Button>
                  {({ showButton, hidden }) => (
                    <div className="flex justify-between w-full items-center">
                      <div
                        className={`
                              absolute ${
                                showButton ? "left-0" : "-left-44"
                              } top-0 w-1/2 h-full transition-all ease-in-out duration-300
                            `}
                      >
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
                            flex items-center gap-2 h-full w-full 
                            rounded-l-lg rounded-r-none bg-gray-600 border border-gray-600 cursor-pointer
                          `}
                          type="button"
                        >
                          <ArrowRightLeft stroke="#FFF" />
                          Trocar
                        </Button>
                      </div>
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
                        onBlur={hidden}
                      />
                    </div>
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
                participants={participants.filter((p) => !p.incident_history)}
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
