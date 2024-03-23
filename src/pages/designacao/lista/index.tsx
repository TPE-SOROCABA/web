import { Button } from "@material-tailwind/react";
import { Participant } from "../../../components";
import { useCallback, useEffect, useState } from "react";
import { useHttp } from "../../../lib";
import { FilterText } from "../../../components/filter";
import { Link, useSearchParams } from "react-router-dom";
import { BoxScreen } from "../../../components/box";
import { IParticipant } from "../../../entity";

export function ListaDesignacao() {
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [searchParams] = useSearchParams();
  const http = useHttp();
  const search = searchParams.get("search");

  const getParticipants = useCallback(async () => {
    try {
      const groupId = "65f9c426559715b69403e28a";
      const url = search
        ? `/participants/${groupId}?filter=${search}`
        : "/users";
      const { data } = await http.get(url);

      const dataParsed = data.map((participant: IParticipant) => ({
        _id: participant._id,
        phone: participant.phone,
        name: participant.name,
        email: participant.email,
        cpf: participant.cpf,
      })) as IParticipant[];
      setParticipants(dataParsed);
    } catch (error) {
      console.error(error);
    }
  }, [http, search]);

  useEffect(() => {
    getParticipants();
  }, [getParticipants]);

  return (
    <BoxScreen>
      <div className="flex justify-between items-center w-full gap-4">
        <FilterText toSearch="Pesquisar Voluntários" />
        <Button
          variant="outlined"
          className="border border-primary-600 rounded-3xl"
          placeholder="Visualização"
          disabled
        >
          Visualização
        </Button>
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
      <div className="flex flex-wrap gap-8 justify-between">
        {participants.map((participant, index) => (
          <Participant.Root key={participant._id} name={participant.name}>
            {/* {({ showMore, setShowMore }) => ( */}
            <Participant.Tag show={index % 2 === 0} tagTitle="Ausente" />
            {/* <Participant.Eye
                  show
                  showMore={showMore}
                  setShowMore={setShowMore}
                  moreText="Motivos de ausencia aqui"
                /> */}
            <Participant.Button>
              {({ showButton }) => {
                console.log(showButton);
                return (
                  <Button
                    placeholder="Botão de ausência"
                    className={`
                      flex justify-center items-center h-full w-40 absolute top-0 rounded-r-lg rounded-l-none z-50 pointer-events-none bg-primary-600 border border-primary-600
                      ${showButton ? "right-0" : "-right-44"}
                    `}
                    type="button"
                  >
                    Ausente
                  </Button>
                );
              }}
            </Participant.Button>
            {/* )} */}
          </Participant.Root>
        ))}
      </div>
    </BoxScreen>
  );
}
