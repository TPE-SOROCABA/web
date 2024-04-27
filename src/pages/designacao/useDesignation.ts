import { useState, useCallback, useEffect } from "react";
import { IParticipant } from "../../entity";
import { useCookies, useHttp, useToastHot } from "../../lib";
import { addFakeImage } from "../../lib/addFakeImage";
import { Assignment, Designation } from "./interfaces";
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
  const [desigantion, setDesignation] = useState<Omit<
    Designation,
    "assignments" | "participants" | "incidents" | "assignmentsFiltered"
  > | null>();

  const getDesignation = useCallback(
    async (props?: { random?: boolean; filter?: string }) => {
      if (!groupId) return console.log("groupId not found");
      const params = {
        groupId,
        filter: props?.filter ?? undefined,
        random: props?.random ?? undefined,
      };
      const { data } = await http.get<Designation>(`/groups/${groupId}/designations/week`, {
        params,
      });
      console.log(data);

      setAssignments(
        shadowCards(
          data.assignments.map((a) => ({
            ...a,
            participants: addFakeImage(a.participants),
          }))
        )
      );
      setParticipants(addFakeImage([...data.participants, ...data.incidents]));

      setFilteredAssignments(
        shadowCards(
          data.assignmentsFiltered.map((a) => ({
            ...a,
            participants: addFakeImage(a.participants),
          }))
        )
      );

      setDesignation({
        id: data.id,
        group: data.group,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
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

  const handleRandom = async () => {
    await toast.promise(getDesignation({ random: true }), {
      loading: "Designando automaticamente...",
      success: "Designação automática realizada com sucesso",
      error: (error) =>
        error?.response?.data?.message || "Erro ao designar automaticamente",
    });
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
        `/designations/${desigantion!.id}/points/${pointId}`,
        {
          status,
        }
      ),
      {
        loading: "Atualizando ponto...",
        success: "Ponto atualizado com sucesso",
        error: (error) =>
          error?.response?.data?.message || "Erro ao atualizar ponto",
      }
    );
  };

  const handleUpdatePointParticipants = async (
    pointId: string,
    participantIds: string[]
  ) => {
    await toast.promise(
      http.put<Designation>(
        `/designations/${desigantion!.id}/points/${pointId}/participants`,
        {
          participants: participantIds,
        }
      ),
      {
        loading: "Atualizando participantes do ponto...",
        success: "Ponto atualizado com sucesso",
        error: (error) =>
          error?.response?.data?.message || "Erro ao atualizar ponto",
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
    desigantion,
    getDesignation,
    handleUpdatePoint,
    handleUpdatePointParticipants,
    createIncidentParticipants,
    handleRandom,
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
