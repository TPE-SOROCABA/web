import { ListFilter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { Participant } from "../../../components/index";
import { useCallback, useEffect, useState } from "react";
import { useCookies, useHttp, useToastHot } from "../../../lib";
import { FilterText } from "../../../components/filter";
import { BoxScreen } from "../../../components/box";
import { IParticipant } from "../../../entity";
import { addFakeImage } from "../../../lib/addFakeImage";
import { AlertAbsentParticipantV2 } from "../components/AlertAbsentParticipantV2";
import { Designation, GroupDetails } from "../interfaces";
import { statusDesignation } from "../const";

let timeout: NodeJS.Timeout | null = null;

type Status = "present" | "absent" | "all";

const isAbsent = (participant: IParticipant) =>
  participant.incident_history?.status === "OPEN";

export function ListaDesignacao() {
  const toast = useToastHot();
  const cookie = useCookies();
  const groupId = cookie.decodeToken()?.groupId;
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [filterByStatus, setFilterByStatus] = useState<Status>("all");
  const [designationStatus, setDesignationStatus] = useState<
    Designation["status"] | null
  >(null);

  const http = useHttp();

  const getParticipants = useCallback(async (search: string = "") => {
    if (!groupId) return console.log("groupId not found");
    const { data } = await http.get<IParticipant[]>(`/participants`, {
      params: {
        groupId,
        filter: search,
      },
    });

    const participantsAbsent = data.filter(isAbsent);
    const participantsActive = data.filter(
      (participant) => !isAbsent(participant)
    );
    setParticipants([...participantsActive, ...participantsAbsent]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGroupDetails = useCallback(async () => {
    if (!groupId) return console.log("groupId not found");
    const { data } = await http.get<GroupDetails>(
      `/groups/${groupId}/designations/week-details`
    );
    setDesignationStatus(data.designation.status);
  }, [groupId, http]);

  useEffect(() => {
    getParticipants();
    getGroupDetails();
  }, [getParticipants, getGroupDetails]);

  const handleSearch = (search: string) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      await toast.promise(getParticipants(search), {
        loading: "Carregando...",
        success: "Busca realizada com sucesso",
        error: "Erro ao buscar",
      });
    }, 500);
  };

  const handleAbsentEvent = async (
    participant: IParticipant,
    reason: string
  ) => {
    await toast.promise(
      http.post(`/participants/${participant.id}/incidences`, {
        reason,
      }),
      {
        loading: "Criando incidente...",
        success: "Incidente criado com sucesso",
        error: (error) =>
          error?.response?.data?.message || "Erro ao criar incidente",
      }
    );
    await toast.promise(getParticipants(), {
      loading: "Carregando...",
      success: "Busca realizada com sucesso",
      error: "Erro ao buscar",
    });
  };

  const handleActiveEvent = async (participant: IParticipant) => {
    await toast.promise(
      http.delete(
        `/participants/${participant.id}/incidences/${participant.incident_history.id}`
      ),
      {
        loading: "Ativando participante",
        success: "Participante ativado",
        error: "Erro ao ativar participante",
      }
    );
    await toast.promise(getParticipants(), {
      loading: "Carregando...",
      success: "Busca realizada com sucesso",
      error: "Erro ao buscar",
    });
  };

  return (
    <BoxScreen
    showBreadcrumbs={true}
      rightContent={
        <>
          <p className="text-primary-800 text-sm font-semibold">
            {designationStatus ? statusDesignation[designationStatus] : ""}
          </p>
        </>
      }
    >
      <div className="flex justify-between items-center w-full gap-4">
        <FilterText
          toSearch="Pesquisar Voluntários"
          handleSearchEvent={handleSearch}
        />
        <FilterStatus
          status={filterByStatus}
          setStatus={(status) => setFilterByStatus(status)}
        />
        <Link to="/lista-designacao/designar">
          <Button
            variant="filled"
            className="bg-primary-600 rounded-3xl px-20 h-12"
            placeholder="Designar"
            type="button"
          >
            Designar
          </Button>
        </Link>
      </div>

      <ListaParticipantes
        designationStatus={designationStatus}
        participants={participants.filter((participant) => {
          if (filterByStatus === "all") return true;
          if (filterByStatus === "present") return !isAbsent(participant);
          if (filterByStatus === "absent") return isAbsent(participant);
          return false;
        })}
        handleAbsentEvent={handleAbsentEvent}
        handleActiveEvent={handleActiveEvent}
      />
    </BoxScreen>
  );
}

interface ListaParticipantesProps {
  designationStatus: Designation["status"] | null;
  participants: IParticipant[];
  handleAbsentEvent: (participant: IParticipant, reason: string) => void;
  handleActiveEvent: (participant: IParticipant) => void;
}

function ListaParticipantes({
  designationStatus,
  participants,
  handleAbsentEvent,
  handleActiveEvent,
}: ListaParticipantesProps) {
  if (!participants.length)
    return (
      <div className="flex justify-center items-center h-96 w-full">
        <h1 className="text-xl text-gray-400">
          Nenhum participante encontrado
        </h1>
      </div>
    );

  return (
    <div
      className="flex flex-wrap gap-8 justify-between w-full "
      hidden={!participants.length}
    >
      {addFakeImage(participants).map((participant) => (
        <Participant.Root
          key={participant.id}
          name={participant.name}
          avatar={participant?.profile_photo}
          className={`
          ${isAbsent(participant) ? "opacity-70 bg-gray-300" : ""}
          `}
          incident_history={isAbsent(participant)}
        >
          {() => {
            if (designationStatus === "CANCELLED") {
              return <></>;
            }
            return (
              <div className={`flex items-center justify-end w-40 gap-2`}>
                <Participant.Tag
                  show={isAbsent(participant)}
                  tagTitle="Ausente"
                />
                {isAbsent(participant) ? (
                  <Participant.Eye
                    moreText={participant.incident_history.reason}
                    buttonEvent={() => {
                      handleActiveEvent(participant);
                    }}
                  />
                ) : (
                  <Participant.Button>
                    {({ showButton, hidden }) => {
                      return (
                        <AlertAbsentParticipantV2
                          showButton={showButton}
                          submitReason={(reason) => {
                            handleAbsentEvent(participant, reason);
                          }}
                          closeComponent={hidden}
                        />
                      );
                    }}
                  </Participant.Button>
                )}
              </div>
            );
          }}
        </Participant.Root>
      ))}
    </div>
  );
}

interface FilterStatusProps {
  status: Status;
  setStatus: (status: Status) => void;
}

function FilterStatus({ status, setStatus }: FilterStatusProps) {
  const [showOptions, setShowOptions] = useState(false);
  const options = [
    {
      name: "present",
      title: "Presente",
      onClick: () => setStatus("present"),
      line: true,
    },
    {
      name: "absent",
      title: "Ausente",
      onClick: () => setStatus("absent"),
      line: true,
    },
    { name: "all", title: "Todos", onClick: () => setStatus("all") },
  ];

  const Option = ({
    title,
    onClick,
    line = false,
  }: {
    title: string;
    onClick: () => void;
    line?: boolean;
  }) => (
    <>
      <div
        className="flex items-center justify-center cursor-pointer w-full h-8 hover:bg-primary-100 transition-all duration-300 ease-in-out"
        onClick={onClick}
      >
        <span>{title}</span>
      </div>
      {line && <div className="w-full h-0.5 bg-primary-300" />}
    </>
  );

  return (
    <div className="relative w-36">
      <Button
        variant="outlined"
        placeholder="Filtrar Status"
        className="flex justify-center gap-4 rounded-3xl border-primary-500 items-center h-12 z-30 focus:outline-none"
        type="button"
        onClick={() => setShowOptions(!showOptions)}
      >
        {status === "all"
          ? "Filtrar"
          : options.find((option) => option.name === status)?.title ||
            "Filtrar"}
        <ListFilter />
      </Button>
      {showOptions && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowOptions(false)}
          />
          <div
            className="absolute z-20 top-8 right-0 bg-white shadow-md rounded-3xl rounded-tr-none rounded-tl-none pt-8 w-full border border-primary-400 border-t-0 flex flex-col justify-around overflow-hidden"
            onClick={() => setShowOptions(false)}
          >
            {options.map((option) => (
              <Option key={option.title} {...option} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
