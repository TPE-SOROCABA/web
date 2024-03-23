import { useCallback, useEffect, useState } from "react";
import { Participant } from "../../components";
import { BoxGroup, BoxScreen } from "../../components/box";
import { FilterText } from "../../components/filter";
import { InputParticipant } from "../../components/participant/Input";
import { IParticipant } from "../../entity";
import { useHttp, useCookies } from "../../lib";
import { Button } from "@material-tailwind/react";
import { Trash } from "lucide-react";

export function Designar() {
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const http = useHttp();

  const getParticipants = useCallback(async () => {
    try {
      const groupId = "65f9c426559715b69403e28a";
      const { data } = await http.get("/participants", {
        params: {
          groupId,
        },
      });

      setParticipants(data);
    } catch (error) {
      console.error(error);
    }
  }, [http]);
  useEffect(() => {
    getParticipants();
  }, [getParticipants]);

  return (
    <>
      <BoxScreen>
        <FilterText toSearch="Pesquisar Voluntários" />
        <div
          className="flex flex-wrap gap-8 justify-between"
          hidden={!participants?.length}
        >
          <BoxGroup pointName="Esfiha do principe" pointCars="3, 4">
            <Participant.Root name={participants[0]?.name}>
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
            <InputParticipant crossOrigin participants={participants} />
          </BoxGroup>
        </div>
      </BoxScreen>
    </>
  );
}
