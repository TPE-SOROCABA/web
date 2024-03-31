import { Button } from "@material-tailwind/react";
import { Participant } from "../../../components/index";
import { useCallback, useEffect, useState } from "react";
import { useCookies, useHttp, useToastHot } from "../../../lib";
import { FilterText } from "../../../components/filter";
import { Link } from "react-router-dom";
import { BoxScreen } from "../../../components/box";
import { IParticipant } from "../../../entity";
import { addFakeImage } from "../../../lib/addFakeImage";
import { AlertAbsentParticipantV2 } from "../components/AlertAbsentParticipantV2";

let timeout: NodeJS.Timeout | null = null;

const isAbsent = (participant: IParticipant) => participant.incident_history?.status === "OPEN";

export function ListaDesignacao() {
  const toast = useToastHot();
  const cookie = useCookies()
  const groupId = cookie.decodeToken()?.groupId
  const [participants, setParticipants] = useState<IParticipant[]>([]);

  const http = useHttp();

  const getParticipants = useCallback(async (search: string = "") => {
    if (!groupId) return console.log('groupId not found')
    const { data } = await http.get<IParticipant[]>(`/participants`, {
      params: {
        groupId,
        filter: search,
      },
    });
    
    const participantsAbsent = data.filter(isAbsent);
    const participantsActive = data.filter(participant => !isAbsent(participant));
    setParticipants([...participantsActive, ...participantsAbsent]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getParticipants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleAbsentEvent = async (participant: IParticipant, reason: string) => {
    await toast.promise(
      http.post(`/participants/${participant.id}/incidences`, {
        reason,
      }),
      {
        loading: "Criando incidente...",
        success: "Incidente criado com sucesso",
        error: (error) => error?.response?.data?.message || "Erro ao criar incidente",
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
      http.put(
        `/participants/${participant.id}/incidences/${participant.incident_history.id}`,
        { status: "IGNORED" }
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
  }

  return (
    <BoxScreen>
      <div className="flex justify-between items-center w-full gap-4">
        <FilterText
          toSearch="Pesquisar Voluntários"
          handleSearchEvent={handleSearch} />
        <Link to="/designar">
          <Button
            variant="filled"
            className="bg-primary-600 rounded-3xl px-20"
            placeholder="Designar"
            type="button"
          >
            Designar
          </Button>
        </Link>
      </div>

      <ListaParticipantes
        participants={participants}
        handleAbsentEvent={handleAbsentEvent}
        handleActiveEvent={handleActiveEvent}
      />
    </BoxScreen>
  );
}

interface ListaParticipantesProps {
  participants: IParticipant[];
  handleAbsentEvent: (participant: IParticipant, reason: string) => void;
  handleActiveEvent: (participant: IParticipant) => void;
}

function ListaParticipantes({ participants, handleAbsentEvent, handleActiveEvent }: ListaParticipantesProps) {
  
  if (!participants.length) return (
    <div className="flex justify-center items-center h-96 w-full">
      <h1 className="text-xl text-gray-400">Nenhum participante encontrado</h1>
    </div>
  )

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
          {() => (
            <div
              className={`flex items-center justify-end w-40 gap-2`}
            >
              <Participant.Tag show={isAbsent(participant)} tagTitle="Ausente" />
              {isAbsent(participant) ? (
                <Participant.Eye
                  moreText={participant.incident_history.reason}
                  buttonEvent={() => {
                    handleActiveEvent(participant)
                  }}
                />)
                : (
                  <Participant.Button>
                    {({ showButton, hidden }) => {
                      return (
                        <AlertAbsentParticipantV2
                          showButton={showButton}
                          submitReason={(reason) => {
                            handleAbsentEvent(participant, reason)
                          }}
                          closeComponent={hidden}
                        />
                      );
                    }}
                  </Participant.Button>
                )
              }

            </div>
          )}
        </Participant.Root>
      ))}
    </div>
  )
}