import { Participant } from "../../components";
import { BoxGroup, BoxScreen } from "../../components/box";
import { FilterText } from "../../components/filter";
import { InputParticipant } from "../../components/participant/Input";
import { useHttp, useToastHot } from "../../lib";
import { Button, Checkbox } from "@material-tailwind/react";
import {
  ArrowRightLeft,
  CheckIcon,
  CopyIcon,
  XIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import { ParticipantsToAssign } from "./components/ParticipantsToAssign";
import { useDesignation } from "./useDesignation";
import { AlertAbsentParticipant } from "./components/AlertAbsentParticipant";
import { IParticipant } from "../../entity";
import { useState } from "react";
import { Designation } from "./interfaces";
import { statusDesignationWithColor } from "./const";
import { CancelDesignation } from "./components/CancelDesignation";
import { AutoDesignation } from "./components/AutoDesignation";

const isAbsent = (participant: IParticipant) =>
  participant.incident_history?.status === "OPEN";

export function Designar() {
  const http = useHttp();
  const toast = useToastHot();
  const {
    filteredAssignments,
    assignments,
    participants,
    designation,
    handleSearch,
    setFilteredAssignments,
    getDesignation,
    handleUpdatePoint,
    handleUpdatePointParticipants,
    createIncidentParticipants,
    setAssignments,
    setParticipants,
  } = useDesignation();
  const [copyStatus, setCopyStatus] = useState<"able" | "copied" | "error">(
    "able"
  );
  const [isOptional, setIsOptional] = useState(false);

  const copyToClipboard = async () => {
    if (!designation?.id) return;
    const linkToCopy = `${window.location.origin}/week-designation/${designation.id}`;

    try {
      await navigator.clipboard.writeText(linkToCopy);
      toast.success("Link copiado com sucesso");
      setCopyStatus("copied");
    } catch (error) {
      toast.error("Erro ao copiar link");
      setCopyStatus("error");
    }

    setTimeout(() => {
      setCopyStatus("able");
    }, 3000);
  };

  const CopyStatusIcon = {
    able: <CopyIcon />,
    copied: <CheckIcon color="green" />,
    error: <XIcon color="red" />,
  };

  const sendDesignation = async () => {
    await toast.promise(
      http.post<Designation>(`/designations/${designation?.id}/send`, {
        optional: isOptional,
      }),
      {
        loading: "Disparando designação...",
        success: "Designação disparada com sucesso",
        error: (error) =>
          error?.response?.data?.message || "Erro ao disparar designação",
      }
    );
    getDesignation();
  };

  return (
    <>
      <BoxScreen
        showBreadcrumbs={true}
        loader={!assignments.length}
        rightContent={
          <>
            {designation?.status && (
              <p className="text-sm">
                Status da Designação:{" "}
                {/* Em aberto (cor amarelo), Em progresso (cor Roxo), Concluído (cor Verde 48 hrs), Arquivado (Azul após 48 hrs), Cancelado (Vermelho) */}
                <span
                  className={`
                font-semibold text-base
                ${statusDesignationWithColor[designation.status].color}
              `}
                >
                  {statusDesignationWithColor[designation.status].text}
                </span>
              </p>
            )}
          </>
        }
      >
        {(() => {
          const totalParticipants = designation?.total.participants || 0;
          const totalVacancies = designation?.total.vacancies || 0;
          return (
            <div
              className={`
                absolute -top-11 left-1/2 -translate-x-1/2 
                rounded-md px-2 py-1 gap-4 shadow-md shadow-gray-500 bg-white h-fit w-fit
                flex justify-around items-center
                ${
                  totalParticipants > totalVacancies
                    ? "text-red-600 fill-red-600"
                    : "text-primary-600 fill-primary-600"
                }
              `}
            >
              <div
                title="Quantidade de Voluntários"
                className="gap-0.5 flex items-center justify-between text-lg"
              >
                <UserIcon className="stroke-transparent fill-inherit" />
                {totalParticipants}
              </div>
              <div
                title="Vagas Disponíveis"
                className="gap-0.5 flex items-center justify-between text-lg"
              >
                <MapPinIcon className="stroke-white fill-inherit" />
                {designation?.total.vacancies || 0}
              </div>
            </div>
          );
        })()}
        {/*  Filtros e botão de designação automática */}
        <div className="w-full justify-between items-center flex gap-4 relative">
          <div className="flex justify-between items-center w-2/5 gap-4">
            <FilterText
              toSearch="Pesquisar Voluntários"
              handleSearchEvent={handleSearch}
              showButton={false}
            />
            <ParticipantsToAssign participants={participants} />
          </div>
          <AutoDesignation
            assignments={assignments}
            getDesignation={getDesignation}
            designationStatus={designation?.status}
          />
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
              {designation?.status === "CANCELLED" ? (
                <DesignationAssignmentsReadOnly
                  assignments={filteredAssignments}
                />
              ) : (
                <DesignationAssignments
                  assignments={filteredAssignments}
                  participants={participants}
                  getDesignation={getDesignation}
                  handleUpdatePoint={handleUpdatePoint}
                  handleUpdatePointParticipants={handleUpdatePointParticipants}
                  createIncidentParticipants={createIncidentParticipants}
                  setAssignments={setFilteredAssignments}
                  setParticipants={setParticipants}
                />
              )}
              <hr className="w-full my-4" />
            </>
          )}
          {/*  Filtrados */}
          {/*  Designação de pontos */}
          {designation?.status === "CANCELLED" ? (
            <DesignationAssignmentsReadOnly assignments={assignments} />
          ) : (
            <DesignationAssignments
              assignments={assignments}
              participants={participants}
              getDesignation={getDesignation}
              handleUpdatePoint={handleUpdatePoint}
              handleUpdatePointParticipants={handleUpdatePointParticipants}
              createIncidentParticipants={createIncidentParticipants}
              setAssignments={setAssignments}
              setParticipants={setParticipants}
            />
          )}
          {/*  Designação de pontos */}
        </div>

        <div className="w-full h-24 flex justify-between">
          <CancelDesignation
            designationId={designation?.id || ""}
            designationStatus={designation?.status || ""}
          />
          {designation?.status === "IN_PROGRESS" ? (
            <div
              onClick={copyToClipboard}
              className={`
                h-12 border border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-100 text-center items-center gap-2
              `}
            >
              <span className="flex items-center gap-2 h-full">
                {" "}
                Copiar <b>Link</b> para visualização{" "}
                {CopyStatusIcon[copyStatus]}
              </span>
            </div>
          ) : null}

          {designation?.status === "OPEN" && (
            <div className="flex flex-col gap-2 justify-center">
              <Button
                className="h-12 bg-primary-600 text-white"
                placeholder={"Disparar designação"}
                onClick={sendDesignation}
                title={
                  assignments.some((a) => Boolean(a.error))
                    ? "Existem pontos com erro"
                    : ""
                }
                disabled={assignments.some((a) => Boolean(a.error))}
              >
                Disparar designação
              </Button>
              <Checkbox
                crossOrigin
                label="Presença Opcional"
                checked={isOptional}
                onChange={() => setIsOptional((old) => !old)}
                className="checked:bg-primary-600 checked:border-primary-600"
              />
            </div>
          )}
        </div>
      </BoxScreen>
    </>
  );
}

type Hook = ReturnType<typeof useDesignation>;

export function DesignationAssignments({
  assignments,
  participants,
  getDesignation,
  handleUpdatePoint,
  handleUpdatePointParticipants,
  createIncidentParticipants,
  setAssignments,
  setParticipants,
}: {
  assignments: Hook["assignments"];
  participants: Hook["participants"];
  getDesignation: Hook["getDesignation"];
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
      <div
        id={assignment.point.id}
        key={assignment.point.id}
        className={` relative
            ${
              assignment.error &&
              assignment.point.status &&
              assignment.participants?.length
                ? "border-2 border-red-500 shadow-lg shadow-red-200"
                : assignment.point.name && "border-0 shadow-lg shadow-gray-200"
            }
          `}
      >
        {assignment?.error &&
        assignment.point.status &&
        assignment.participants?.length ? (
          <div
            className={`
              absolute z-50 flex justify-center items-center text-center -top-11 w-full rounded-2xl p-1
              bg-white border border-red-500 animate-bounce ease-in-out duration-300 shadow-md shadow-red-200
            `}
          >
            {assignment.error}
          </div>
        ) : null}
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
                participants={participants.filter(
                  (p) =>
                    !p.incident_history &&
                    p.profile !== "COORDINATOR" &&
                    p.profile !== "CAPTAIN"
                )}
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
                  await toast.promise(getDesignation(), {
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

export function DesignationAssignmentsReadOnly({
  assignments,
}: {
  assignments: Hook["assignments"];
}) {
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
          boxGroupEvent={() => {}}
          readonly
        >
          {assignment.participants.map((participant) => (
            <Participant.Root
              name={participant.name}
              key={participant.id}
              avatar={participant.profile_photo}
              incident_history={isAbsent(participant)}
            />
          ))}
        </BoxGroup>
      </div>
    );
  });
}
