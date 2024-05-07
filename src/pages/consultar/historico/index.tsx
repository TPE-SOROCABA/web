import { useCallback, useEffect, useState } from "react";
import { DateRangePicker } from "rsuite";
import dayjs from "dayjs";
import { BoxScreen } from "../../../components/box";
import { statusDesignation } from "../../designacao/const";
import { Designation } from "../../designacao/interfaces";
import { useCookies, useHttp } from "../../../lib";
import { DownloadIcon } from "lucide-react";
import { ModalDesignation } from "./modalDesignation";

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

interface DateRange {
  from: Date;
  to: Date;
}

export function ConsultarHistorico() {
  const [history, setHistory] = useState<HistoryDesignation[]>();
  const [date, setDate] = useState<DateRange | null>(null);
  const http = useHttp();
  const cookie = useCookies();
  const groupId = cookie.decodeToken()?.groupId;

  const getHistory = useCallback(async () => {
    if (!groupId) return console.log("groupId not found");
    const endpoint = `/groups/${groupId}/designations`;
    let url = `${endpoint}`;
    if (date) {
      const query = new URLSearchParams({
        dateFrom: dayjs(date.from).format("YYYY-MM-DD"),
        dateTo: dayjs(date.to).format("YYYY-MM-DD"),
      });
      url += `?${query}`;
    }
    const { data } = await http.get(url);
    setHistory(data);
  }, [date, groupId, http]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateDate = (value: any) => {
    if (!value) {
      setDate(null);
      return;
    }
    setDate({
      from: value[0],
      to: value[1],
    });
  };

  return (
    <>
      <BoxScreen
        loader={Boolean(!history?.length)}
      >
        <div className="flex items-center justify-start w-full gap-4">
          <DateRangePicker
            format="dd/MM/yyyy"
            value={date && [date.from, date.to]}
            onChange={(value) => updateDate(value)}
            title="Selecione o intervalo de datas"
            placeholder="Selecione o intervalo de datas"
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-primary-300 text-primary-400 font-bold">
              <th className="text-left">Data da Designação</th>
              <th>Status</th>
              <th>Presença</th>
              <th>Visualizar</th>
              <th>Baixar</th>
            </tr>
          </thead>
          <tbody>
            {history?.map((item, index, list) => (
              <tr
                key={item.id}
                className={`
                  text-center h-10 border-b-2 border-primary-300 text-primary-400
                  ${index === list.length - 1 ? "border-b-0" : ""}
                `}
              >
                <td className="text-left">
                  {translateWeekDay(item.designationDate)}{" "}
                  {dayjs(item.designationDate).format("DD/MM/YYYY")}
                </td>
                <td>{statusDesignation[item.status]}</td>
                <td>
                  {item.mandatoryPresence ? "Obrigatória" : "Não Obrigatória"}
                </td>
                <td>
                  <ModalDesignation
                    designationId={item.id}
                    designationDate={item.designationDate}
                  />
                </td>
                <td>
                  <button type="button" disabled title="Em breve">
                    <DownloadIcon className="stroke-gray-600 cursor-not-allowed" />
                  </button>
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
