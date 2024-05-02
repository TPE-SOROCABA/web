import {
  useState,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { IParticipant } from "../../entity";
import { useCookies, useHttp, useToastHot } from "../../lib";
import { Assignment, Designation } from "./interfaces";
import { AxiosError } from "axios";
let timeout: NodeJS.Timeout;

export const useDesignation = () => {
  const http = useHttp();
  const toast = useToastHot();
  const cookie = useCookies();
  const groupId = cookie.decodeToken()?.groupId;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(
    []
  );
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [designation, setDesignation] = useState<Omit<
    Designation,
    "assignments" | "participants" | "incidents" | "assignmentsFiltered"
  > | null>();
  const query = new URLSearchParams(window.location.search);

  const getDesignation = useCallback(
    async (props?: { random?: boolean; filter?: string }) => {
      if (!groupId) return console.log("groupId not found");
      const params = {
        groupId,
        filter: props?.filter ?? undefined,
        random: props?.random ?? undefined,
      };
      const { data } = await http.get<Designation>(
        `/groups/${groupId}/designations/week`,
        {
          params,
        }
      );
      setAssignments(shadowCards(data.assignments));
      setParticipants([...data.participants, ...data.incidents]);

      setFilteredAssignments(shadowCards(data.assignmentsFiltered));

      setDesignation({
        id: data.id,
        group: data.group,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        total: data.total,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getDesignation();

    const resize = () => {
      setAssignments((a) => shadowCards(a));
      setFilteredAssignments((a) => shadowCards(a));
    };

    addEventListener("resize", resize);

    return () => {
      removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shadowCards = (assignments: Assignment[]): Assignment[] => {
    const CARD_WIDTH = 330;
    const SIDE_BAR_WIDTH = 64;
    const WINDOW_WIDTH = window.innerWidth - SIDE_BAR_WIDTH - 208;

    const quantityCards = assignments.filter((a) => a.point.id).length;
    const cardsByRow = Math.floor(WINDOW_WIDTH / CARD_WIDTH);

    type LineRaw = Assignment[];
    type Line = LineRaw[];

    const lines: Line = [];
    let currentLine = 0;
    Array.from({ length: quantityCards }).forEach((_, index) => {
      if (lines[currentLine]?.length === cardsByRow) {
        currentLine++;
      }
      if (!lines[currentLine]?.length) {
        lines[currentLine] = [];
      }
      lines[currentLine].push(assignments[index]);
    });

    const lastLine = lines.at(-1);
    const lastLineLength = lastLine?.length || 0;
    if (lastLineLength < cardsByRow && lastLine) {
      const emptyCards = cardsByRow - lastLineLength;
      Array.from({ length: emptyCards }).forEach(() => {
        lastLine.push(SHADOW_ASSIGNMENT);
      });
    }

    const newAssignments = lines.flat();
    return newAssignments;
  };

  const handleSearch = async (search: string) => {
    timeout && clearTimeout(timeout);
    if (!search) return getDesignation();
    timeout = setTimeout(async () => {
      await toast.promise(getDesignation({ filter: search }), {
        loading: "Buscando participantes e pontos...",
        success: "Busca realizada com sucesso",
        error: "Erro ao buscar participantes e pontos",
      });
    }, 800);
  };

  const handleUpdatePoint = async (pointId: string, status: boolean) => {
    await toast.promise(
      http.patch<Designation>(
        `/designations/${designation!.id}/points/${pointId}`,
        {
          status,
        }
      ),
      {
        loading: "Atualizando ponto...",
        success: ({ data }) => {
          const newDesignation = {
            createdAt: data.createdAt,
            group: data.group,
            id: data.id,
            status: data.status,
            updatedAt: data.updatedAt,
            total: {
              participants: data.total.participants,
              vacancies: data.total.vacancies,
            },
          };

          setDesignation(newDesignation);
          return "Ponto atualizado com sucesso";
        },
        error: (error) =>
          error?.response?.data?.message || "Erro ao atualizar ponto",
      }
    );
  };

  const handleUpdatePointParticipants = async (
    pointId: string,
    participantIds: string[]
  ) => {
    const updateAssignments = (
      assignmentsOld: Assignment[],
      assignmentsNew: Assignment[]
    ) => {
      const assignmentNew = assignmentsNew.find((a) => a.point.id === pointId);

      if (!assignmentNew) return assignmentsOld;
      return assignmentsOld.map((a) =>
        a.point.id === pointId ? assignmentNew : a
      );
    };

    const validateAssignments = (
      assignments: Assignment[],
      setAssignments: Dispatch<SetStateAction<Assignment[]>>
    ) => {
      let message = "";
      const assignmentsNew: Designation["assignments"] = assignments;

      const assignmentsToUse = updateAssignments(assignments, assignmentsNew);
      setAssignments((a) => updateAssignments(a, assignmentsNew));

      const assignment = assignmentsToUse.find((a) => a.point.id === pointId);
      if (assignment?.error) {
        message = assignment.error;
        const card = document.getElementById(assignment.point.id);
        if (card) {
          card.style.marginTop = "-120px";
          card.style.borderRadius = "8px";
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.style.marginTop = "0px";
        }
      }
      return {
        message,
      };
    };

    await toast.promise(
      http.put<Designation>(
        `/designations/${designation!.id}/points/${pointId}/participants`,
        {
          participants: participantIds,
          filter: query.get("search"),
        }
      ),
      {
        loading: "Atualizando participantes do ponto...",
        success: ({ data }): string => {
          setAssignments((a) => updateAssignments(a, data.assignments));
          setFilteredAssignments((a) =>
            updateAssignments(a, data.assignmentsFiltered)
          );
          return "Ponto atualizado com sucesso";
        },
        error: (error) => {
          let message = "Erro ao atualizar ponto";
          const errorAxios = error instanceof AxiosError;
          if (!error.response?.data?.assignments?.length || !errorAxios) {
            return message;
          }
          const { message: messageErrorFirst } = validateAssignments(
            error.response.data.assignments,
            setAssignments
          );
          if (messageErrorFirst) {
            message = messageErrorFirst;
          }

          const { message: messageErrorSecond } = validateAssignments(
            error.response.data.assignmentsFiltered,
            setFilteredAssignments
          );
          if (messageErrorSecond) {
            message = messageErrorSecond;
          }

          return message;
        },
      }
    );
  };

  const createIncidentParticipants = async (
    participantId: string,
    reason: string
  ) => {
    await toast.promise(
      http.post<Designation>(`/participants/${participantId}/incidences`, {
        reason,
      }),
      {
        loading: "Atualizando participantes do ponto...",
        success: "Ponto atualizado com sucesso",
        error: (error) =>
          error?.response?.data?.message || "Erro ao atualizar ponto",
      }
    );
    await getDesignation();
  };

  return {
    filteredAssignments,
    assignments,
    participants,
    designation,
    getDesignation,
    handleUpdatePoint,
    handleUpdatePointParticipants,
    createIncidentParticipants,
    handleSearch,
    setAssignments,
    setParticipants,
    setFilteredAssignments,
  };
};

const SHADOW_ASSIGNMENT: Assignment = {
  point: {
    id: "",
    name: "",
    status: false,
  },
  publication_carts: [],
  participants: [],
  config: {
    max: 0,
    min: 0,
  },
};
