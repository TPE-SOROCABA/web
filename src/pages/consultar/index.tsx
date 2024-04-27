import { useCallback, useEffect, useState } from "react";
import { BoxScreen } from "../../components/box";
import { DateRangePicker } from "rsuite";
import { useCookies, useHttp } from "../../lib";
import { Designation } from "../designacao/interfaces";
import { statusDesignation } from "../designacao/const";
import dayjs from "dayjs";

interface HistoryDesignation {
  id: string;
  name: string;
  groupId: string;
  status: Designation["status"];
  createdAt: string;
  updatedAt: string;
  designationDate: string;
  mandatoryPresence: boolean;
  cancellationJustification: string;
}

export function ConsultarHistorico() {
  const [history, setHistory] = useState<HistoryDesignation[]>();
  const http = useHttp();
  const cookie = useCookies();
  const groupId = cookie.decodeToken()?.groupId;

  const getHistory = useCallback(async () => {
    if (!groupId) return console.log("groupId not found");
    const { data } = await http.get(`/groups/${groupId}/designations`);
    setHistory(data);
  }, [groupId, http]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  return (
    <>
      <BoxScreen>
        <div className="flex items-center justify-start w-full gap-4">
          <DateRangePicker />
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Data da Designação</th>
              <th>Status</th>
              <th>Presença</th>
              <th>Visualizar</th>
              <th>Baixar</th>
            </tr>
          </thead>
          <tbody>
            {history?.map((item) => (
              <tr key={item.id} className="text-center h-10">
                <td className="text-left">
                  {translateWeekDay(item.designationDate)}{" "}
                  {dayjs(item.designationDate).format("DD/MM/YYYY")}
                </td>
                <td>{statusDesignation[item.status]}</td>
                <td>
                  {item.mandatoryPresence ? "Obrigatória" : "Não Obrigatória"}
                </td>
                <td>
                  <button>Visualizar</button>
                </td>
                <td>
                  <button>Baixar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </BoxScreen>
    </>
  );
}

const translateWeekDay = (date: string) =>
  ({
    Sunday: "Domingo",
    Monday: "Segunda-Feira",
    Tuesday: "Terça-Feira",
    Wednesday: "Quarta-Feira",
    Thursday: "Quinta-Feira",
    Friday: "Sexta-Feira",
    Saturday: "Sábado",
  }[dayjs(date).format("dddd")]);
